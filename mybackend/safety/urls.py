from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('helplines', views.HelplineViewSet, basename='helpline')
router.register('contacts', views.EmergencyContactViewSet, basename='contact')
router.register('sos', views.SOSAlertViewSet, basename='sos')
router.register('tips', views.SafetyTipViewSet, basename='tip')
router.register('location', views.LocationShareViewSet, basename='location')
router.register('checkin', views.SafetyCheckInViewSet, basename='checkin')

urlpatterns = [
    path('', include(router.urls)),
]