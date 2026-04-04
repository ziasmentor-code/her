from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # JWT Authentication URLs
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Your apps
    path('api/auth/', include('accounts.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/anonymous/', include('anonymous_posts.urls')),
    path('api/safety/', include('safety.urls')),
    path('api/counseling/', include('counseling.urls')),
    path('api/jobs/', include('jobs.urls')),
    
    # API app for login/register
    path('api/', include('api.urls')),  
     path('api/donate/', include('donate.urls')),
    # Add this for login/register endpoints
    
    # Home page (your weather app)
    path('', include('her.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)