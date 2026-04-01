from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categories', views.CourseCategoryViewSet, basename='course-category')
router.register('courses', views.CourseViewSet, basename='course')
router.register('enrollments', views.EnrollmentViewSet, basename='enrollment')
router.register('certificates', views.CertificateViewSet, basename='certificate')

urlpatterns = [
    path('', include(router.urls)),
]