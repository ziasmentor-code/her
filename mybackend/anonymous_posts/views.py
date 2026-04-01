from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
import random
import uuid
from django.db.models import Q

from .models import (
    AnonymousPost, AnonymousComment,
    AnonymousChatRoom, AnonymousChatMessage, 
    AnonymousPoll, AnonymousPollVote
)
from .serializers import (
    AnonymousPostSerializer, AnonymousCommentSerializer,
    AnonymousChatRoomSerializer, AnonymousChatMessageSerializer,
    CreateAnonymousChatRoomSerializer, AnonymousPollSerializer,
    AnonymousPollVoteSerializer
)

# Your existing AnonymousPostViewSet
class AnonymousPostViewSet(viewsets.ModelViewSet):
    queryset = AnonymousPost.objects.filter(is_approved=True)
    serializer_class = AnonymousPostSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            anonymous_id=f"User_{random.randint(10000, 99999)}",
            is_approved=True
        )
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        post.likes += 1
        post.save()
        return Response({'likes': post.likes})

# Your existing AnonymousCommentViewSet
class AnonymousCommentViewSet(viewsets.ModelViewSet):
    queryset = AnonymousComment.objects.all()
    serializer_class = AnonymousCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            anonymous_id=f"User_{random.randint(10000, 99999)}"
        )

# New AnonymousChatRoomViewSet
class AnonymousChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = AnonymousChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AnonymousChatRoom.objects.filter(
            participants=self.request.user,
            is_active=True
        )
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateAnonymousChatRoomSerializer
        return AnonymousChatRoomSerializer
    
    def perform_create(self, serializer):
        room = serializer.save()
        room.participants.add(self.request.user)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        chat_room = self.get_object()
        serializer = AnonymousChatMessageSerializer(data={
            'chat_room': chat_room.id,
            'message_type': request.data.get('message_type', 'text'),
            'content': request.data.get('content'),
            'media_url': request.data.get('media_url', '')
        })
        serializer.is_valid(raise_exception=True)
        serializer.save(
            sender=request.user,
            sender_anonymous_id=chat_room.get_anonymous_id(request.user)
        )
        
        # Update last message time
        chat_room.last_message_at = timezone.now()
        chat_room.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        chat_room = self.get_object()
        messages = chat_room.messages.all()
        
        # Mark messages as read
        for msg in messages:
            if msg.sender != request.user and not msg.is_read:
                msg.is_read = True
                msg.read_by.add(request.user)
        
        serializer = AnonymousChatMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def start_poll(self, request, pk=None):
        chat_room = self.get_object()
        serializer = AnonymousPollSerializer(data={
            'chat_room': chat_room.id,
            'question': request.data.get('question'),
            'options': request.data.get('options'),
            'expires_at': request.data.get('expires_at')
        }, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def vote_poll(self, request, pk=None):
        poll_id = request.data.get('poll_id')
        try:
            poll = AnonymousPoll.objects.get(id=poll_id, chat_room_id=pk)
        except AnonymousPoll.DoesNotExist:
            return Response({'error': 'Poll not found'}, status=404)
        
        if poll.has_expired():
            return Response({'error': 'Poll has expired'}, status=400)
        
        if AnonymousPollVote.objects.filter(poll=poll, user=request.user).exists():
            return Response({'error': 'Already voted'}, status=400)
        
        serializer = AnonymousPollVoteSerializer(data={
            'poll': poll.id,
            'selected_option': request.data.get('selected_option')
        })
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        
        # Update vote count
        votes = poll.votes or {}
        option_key = f"option_{serializer.validated_data['selected_option']}"
        votes[option_key] = votes.get(option_key, 0) + 1
        poll.votes = votes
        poll.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)