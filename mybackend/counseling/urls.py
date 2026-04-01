from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('counselors', views.CounselorViewSet, basename='counselor')
router.register('sessions', views.CounselingSessionViewSet, basename='session')
router.register('reviews', views.SessionReviewViewSet, basename='review')
router.register('crisis', views.CrisisHelplineViewSet, basename='crisis')

urlpatterns = [
    path('', include(router.urls)),
]