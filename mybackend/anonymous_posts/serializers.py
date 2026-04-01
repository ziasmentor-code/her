from rest_framework import serializers
from .models import (
    AnonymousPost, AnonymousComment, 
    AnonymousChatRoom, AnonymousChatMessage, 
    AnonymousPoll, AnonymousPollVote
)

# Existing serializers
class AnonymousPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnonymousPost
        fields = ['id', 'post_type', 'content', 'tags', 'likes', 'created_at']
        read_only_fields = ['id', 'likes', 'created_at']

class AnonymousCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnonymousComment
        fields = ['id', 'post', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']

# New Chat Serializers
class AnonymousChatRoomSerializer(serializers.ModelSerializer):
    participants_count = serializers.IntegerField(source='participants.count', read_only=True)
    last_message = serializers.SerializerMethodField()
    user_anonymous_id = serializers.SerializerMethodField()
    
    class Meta:
        model = AnonymousChatRoom
        fields = ['id', 'room_type', 'room_name', 'participants_count', 'last_message', 
                  'user_anonymous_id', 'is_active', 'last_message_at', 'created_at']
        read_only_fields = ['id', 'created_at', 'last_message_at']
    
    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'content': last_msg.content[:50],
                'sender': last_msg.sender_anonymous_id,
                'created_at': last_msg.created_at
            }
        return None
    
    def get_user_anonymous_id(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.get_anonymous_id(request.user)
        return None

class AnonymousChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnonymousChatMessage
        fields = ['id', 'chat_room', 'sender_anonymous_id', 'message_type', 
                  'content', 'media_url', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender_anonymous_id', 'created_at']

class CreateAnonymousChatRoomSerializer(serializers.ModelSerializer):
    participant_ids = serializers.ListField(child=serializers.UUIDField(), write_only=True)
    
    class Meta:
        model = AnonymousChatRoom
        fields = ['room_type', 'room_name', 'participant_ids', 'expert']
    
    def create(self, validated_data):
        participant_ids = validated_data.pop('participant_ids')
        room = AnonymousChatRoom.objects.create(**validated_data)
        room.participants.add(*participant_ids)
        return room

class AnonymousPollSerializer(serializers.ModelSerializer):
    total_votes = serializers.SerializerMethodField()
    user_voted = serializers.SerializerMethodField()
    
    class Meta:
        model = AnonymousPoll
        fields = ['id', 'chat_room', 'question', 'options', 'votes', 'is_active', 
                  'expires_at', 'total_votes', 'user_voted', 'created_at']
        read_only_fields = ['id', 'votes', 'created_at']
    
    def get_total_votes(self, obj):
        return sum(obj.votes.values()) if obj.votes else 0
    
    def get_user_voted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return AnonymousPollVote.objects.filter(poll=obj, user=request.user).exists()
        return False

class AnonymousPollVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnonymousPollVote
        fields = ['poll', 'selected_option']