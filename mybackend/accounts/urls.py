from django.urls import path
from . import views

urlpatterns = [
    # Custom Admin URLs
    path('admin/', views.admin_login_page, name='admin_login_page'),
    path('admin/login/', views.admin_login, name='admin_login'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/logout/', views.admin_logout, name='admin_logout'),
    
    # API URL (if needed)
    path('api/login/', views.api_login, name='api_login'),
]