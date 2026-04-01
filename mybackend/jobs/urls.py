from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categories', views.JobCategoryViewSet, basename='job-category')
router.register('employers', views.EmployerViewSet, basename='employer')
router.register('jobs', views.JobListingViewSet, basename='job')  # Changed from 'listings' to 'jobs'
router.register('applications', views.JobApplicationViewSet, basename='application')
router.register('saved', views.SavedJobViewSet, basename='saved-job')
router.register('alerts', views.JobAlertViewSet, basename='job-alert')

urlpatterns = [
    path('', include(router.urls)),
]