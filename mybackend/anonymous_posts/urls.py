from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('posts', views.AnonymousPostViewSet, basename='anonymous-post')
router.register('comments', views.AnonymousCommentViewSet, basename='anonymous-comment')
router.register('chats', views.AnonymousChatRoomViewSet, basename='anonymous-chat')  # Add this

urlpatterns = [
    path('', include(router.urls)),
]