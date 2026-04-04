from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# ============================================
# CUSTOM ADMIN LOGIN PAGE
# ============================================
def admin_login_page(request):
    """Custom Admin Login Page"""
    if request.user.is_authenticated and request.user.is_superuser:  # Changed to is_superuser
        return redirect('admin_dashboard')
    return render(request, 'admin/login.html')

# ============================================
# CUSTOM ADMIN LOGIN HANDLER
# ============================================
def admin_login(request):
    """Handle admin login"""
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(username=user_obj.username, password=password)
            
            if user:
                if user.is_superuser and user.is_active:  # Changed to is_superuser
                    auth_login(request, user)
                    return redirect('admin_dashboard')
                else:
                    return render(request, 'admin/login.html', {
                        'error': 'Access Denied: Admin privileges required'
                    })
            else:
                return render(request, 'admin/login.html', {
                    'error': 'Invalid email or password'
                })
        except User.DoesNotExist:
            return render(request, 'admin/login.html', {
                'error': 'Invalid email or password'
            })
    
    return redirect('admin_login_page')

# ============================================
# CUSTOM ADMIN DASHBOARD
# ============================================
@login_required
def admin_dashboard(request):
    """Custom Admin Dashboard"""
    if not request.user.is_superuser:  # Changed to is_superuser
        return redirect('admin_login_page')
    
    context = {
        'user': request.user,
        'total_users': User.objects.count(),
        'total_admins': User.objects.filter(is_superuser=True).count(),  # Changed
        'total_mentors': User.objects.filter(is_mentor=True).count(),  # Requires is_mentor field
        'total_doctors': User.objects.filter(is_doctor=True).count(),  # Requires is_doctor field
        'recent_users': User.objects.order_by('-date_joined')[:5],
    }
    return render(request, 'admin/dashboard.html', context)

# ============================================
# CUSTOM ADMIN LOGOUT
# ============================================
def admin_logout(request):
    """Admin logout"""
    auth_logout(request)
    return redirect('admin_login_page')

# ============================================
# API LOGIN (for mobile apps)
# ============================================
@api_view(['POST'])
def api_login(request):
    """API login"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user_obj = User.objects.get(email=email)
        user = authenticate(username=user_obj.username, password=password)
        
        # ✅ Fixed indentation here (4 spaces before if)
        if user and user.is_superuser and user.is_active:
            refresh = RefreshToken.for_user(user)
            return Response({
                'success': True,  # Added success field
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_superuser': user.is_superuser,  # Changed
                }
            })
        return Response({'error': 'Invalid credentials'}, status=401)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=401)