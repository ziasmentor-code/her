# api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Auth endpoints
    path('register/', views.register_user, name='register'),
    path('user/login/', views.user_login, name='user_login'),  # 👈 Add this
    path('admin/login/', views.admin_login, name='admin_login'),
    
    # Dashboard
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    
    # User management (admin only)
    path('admin/users/', views.get_users, name='get_users'),
    path('admin/users/me/', views.get_current_user, name='get_current_user'),
    path('admin/users/<uuid:user_id>/', views.get_user_detail, name='get_user_detail'),
    path('admin/users/<uuid:user_id>/role/', views.update_user_role, name='update_user_role'),
    path('admin/users/<uuid:user_id>/verify/', views.toggle_user_verification, name='toggle_verification'),
    path('admin/users/<uuid:user_id>/status/', views.update_user_active_status, name='update_user_status'),
    path('admin/users/<uuid:user_id>/delete/', views.delete_user, name='delete_user'),
    
    # Test
    path('admin/test/', views.test_auth, name='test_auth'),
]