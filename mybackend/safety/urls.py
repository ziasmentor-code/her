from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SOSAlertViewSet, EmergencyContactViewSet, EmergencyResourceViewSet

router = DefaultRouter()
router.register('sos-alerts', SOSAlertViewSet, basename='sos')
router.register('emergency-contacts', EmergencyContactViewSet, basename='contacts')
router.register('emergency-resources', EmergencyResourceViewSet, basename='resources')

urlpatterns = [
    path('', include(router.urls)),
]