from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Admin users only
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin and
            request.user.status == 'active'  # status check
        )
    
    def has_object_permission(self, request, view, obj):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin and
            request.user.status == 'active'
        )


class IsMentor(permissions.BasePermission):
    """
    Mentor users only
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_mentor and
            request.user.status == 'active'
        )


class IsDoctor(permissions.BasePermission):
    """
    Doctor users only
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_doctor and
            request.user.status == 'active'
        )


class IsUser(permissions.BasePermission):
    """
    Normal users only
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_user and
            request.user.status == 'active'
        )


class IsAdminOrSelf(permissions.BasePermission):
    """
    Admin can access any object, users can only access their own object
    """
    def has_permission(self, request, view):
        # For list views, admin can see all, users see only their own
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if request.user.is_admin:
            return True
        
        # Users can only access their own object
        return obj == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Admin can do anything, others can only read
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:  # GET, HEAD, OPTIONS
            return True
        return request.user.is_authenticated and request.user.is_admin


class IsMentorOrDoctor(permissions.BasePermission):
    """
    Either Mentor or Doctor can access
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_mentor or request.user.is_doctor) and
            request.user.status == 'active'
        )


class IsAdminOrMentor(permissions.BasePermission):
    """
    Admin or Mentor can access
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_admin or request.user.is_mentor) and
            request.user.status == 'active'
        )


class RoleBasedPermission(permissions.BasePermission):
    """
    Dynamic role-based permission
    """
    def __init__(self, allowed_roles=None):
        self.allowed_roles = allowed_roles or []
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check if user has any of the allowed roles
        for role in self.allowed_roles:
            if getattr(request.user, f'is_{role}', False):
                return True
        
        return False
    
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)