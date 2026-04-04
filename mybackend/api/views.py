# api/views.py
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

User = get_user_model()

# ============================================
# USER REGISTRATION
# ============================================
@api_view(['POST'])
def register_user(request):
    """Register a new user"""
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role', 'USER')
    
    if not username or not email or not password:
        return Response({
            'success': False,
            'error': 'Username, email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({
            'success': False,
            'error': 'Username already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({
            'success': False,
            'error': 'Email already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        validate_email(email)
    except ValidationError:
        return Response({
            'success': False,
            'error': 'Invalid email address'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    valid_roles = ['USER', 'MENTOR', 'DOCTOR']
    if role not in valid_roles:
        role = 'USER'
    
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            is_active=True,
            is_verified=False
        )
        
        return Response({
            'success': True,
            'message': 'User registered successfully',
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'is_verified': user.is_verified
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


# ============================================
# ADMIN LOGIN
# ============================================
@api_view(['POST'])
def admin_login(request):
    """API login for admin"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'success': False,
            'error': 'Email and password required'
        }, status=400)
    
    try:
        user_obj = User.objects.get(email=email)
        user = authenticate(username=user_obj.username, password=password)
        
        if user and (user.role == User.Role.ADMIN or user.is_superuser) and user.is_active:
            refresh = RefreshToken.for_user(user)
            return Response({
                'success': True,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': str(user.id),
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'display_name': user.display_name,
                    'is_verified': user.is_verified,
                }
            })
        return Response({
            'success': False,
            'error': 'Invalid credentials or admin access only'
        }, status=401)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Invalid credentials'
        }, status=401)


# ============================================
# ADMIN DASHBOARD
# ============================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    """Get admin dashboard statistics"""
    user = request.user
    
    if not (user.role == User.Role.ADMIN or user.is_superuser):
        return Response({'error': 'Admin access required'}, status=403)
    
    all_users = User.objects.all()
    
    return Response({
        'total_users': all_users.count(),
        'total_admins': all_users.filter(role=User.Role.ADMIN).count(),
        'total_mentors': all_users.filter(role=User.Role.MENTOR).count(),
        'total_doctors': all_users.filter(role=User.Role.DOCTOR).count(),
        'total_verified': all_users.filter(is_verified=True).count(),
        'recent_users': list(all_users.order_by('-created_at')[:10].values(
            'id', 'username', 'email', 'role', 'display_name', 'is_verified', 'is_active'
        ))
    })


# ============================================
# GET ALL USERS
# ============================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    """Get all users with their details (admin only)"""
    user = request.user
    
    if not (user.role == User.Role.ADMIN or user.is_superuser):
        return Response({'error': 'Admin access required'}, status=403)
    
    users = User.objects.all().values(
        'id', 'username', 'email', 'role', 'display_name', 
        'phone_number', 'is_verified', 'is_active', 'created_at',
        'specialization', 'years_of_experience'
    )
    
    users_list = []
    for u in users:
        user_dict = dict(u)
        user_dict['role_display'] = dict(User.Role.choices).get(user_dict.get('role'), 'User')
        users_list.append(user_dict)
    
    return Response(users_list)


# ============================================
# GET CURRENT USER
# ============================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current logged in user info"""
    user = request.user
    return Response({
        'id': str(user.id),
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'is_superuser': user.is_superuser,
        'is_active': user.is_active,
    })


# ============================================
# GET USER BY ID
# ============================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_detail(request, user_id):
    """Get specific user details"""
    admin_user = request.user
    
    if not (admin_user.role == User.Role.ADMIN or admin_user.is_superuser):
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        user = User.objects.get(id=user_id)
        return Response({
            'id': str(user.id),
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'role_display': user.get_role_display(),
            'display_name': user.display_name,
            'phone_number': user.phone_number,
            'bio': user.bio,
            'is_verified': user.is_verified,
            'is_active': user.is_active,
            'specialization': user.specialization,
            'years_of_experience': user.years_of_experience,
            'created_at': user.created_at,
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


# ============================================
# UPDATE USER ROLE
# ============================================
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_role(request, user_id):
    """Update user role (admin only)"""
    admin_user = request.user
    
    if not (admin_user.role == User.Role.ADMIN or admin_user.is_superuser):
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        user_to_update = User.objects.get(id=user_id)
        new_role = request.data.get('role')
        
        if new_role in [User.Role.USER, User.Role.MENTOR, User.Role.DOCTOR, User.Role.ADMIN]:
            user_to_update.role = new_role
            user_to_update.save()
            return Response({'message': f'User role updated to {new_role}'})
        else:
            return Response({'error': 'Invalid role'}, status=400)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


# ============================================
# TOGGLE USER VERIFICATION
# ============================================
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def toggle_user_verification(request, user_id):
    """Verify or unverify a user"""
    admin_user = request.user
    
    if not (admin_user.role == User.Role.ADMIN or admin_user.is_superuser):
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        user_to_update = User.objects.get(id=user_id)
        user_to_update.is_verified = not user_to_update.is_verified
        user_to_update.save()
        
        status_text = "verified" if user_to_update.is_verified else "unverified"
        return Response({'message': f'User {status_text} successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


# ============================================
# UPDATE USER ACTIVE STATUS
# ============================================
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_active_status(request, user_id):
    """Update user active status"""
    admin_user = request.user
    
    if not (admin_user.role == User.Role.ADMIN or admin_user.is_superuser):
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        user_to_update = User.objects.get(id=user_id)
        is_active = request.data.get('is_active', True)
        
        user_to_update.is_active = is_active
        user_to_update.save()
        
        return Response({'message': f'User status updated to {"active" if is_active else "inactive"}'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


# ============================================
# DELETE USER
# ============================================
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    """Delete a user (admin only)"""
    admin_user = request.user
    
    if not (admin_user.role == User.Role.ADMIN or admin_user.is_superuser):
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        user_to_delete = User.objects.get(id=user_id)
        
        if str(user_to_delete.id) == str(admin_user.id):
            return Response({'error': 'Cannot delete yourself'}, status=400)
        
        user_to_delete.delete()
        return Response({'message': 'User deleted successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


# ============================================
# TEST AUTH
# ============================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_auth(request):
    """Test endpoint"""
    return Response({
        'authenticated': True,
        'user': request.user.username,
        'role': request.user.role,
        'message': 'Authentication working!'
    })

@api_view(['POST'])
def user_login(request):
    """API login for regular users (non-admin)"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'success': False,
            'error': 'Username and password required'
        }, status=400)
    
    user = authenticate(username=username, password=password)
    
    if user and user.is_active:
        # Check if user is trying to login as regular user (not forcing admin)
        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'display_name': user.display_name,
                'is_verified': user.is_verified,
                'is_active': user.is_active,
            }
        })
    
    return Response({
        'success': False,
        'error': 'Invalid username or password'
    }, status=401)