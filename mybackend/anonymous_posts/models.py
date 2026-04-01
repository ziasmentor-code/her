import uuid
import random
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AnonymousPost(models.Model):
    POST_TYPES = [
        ('question', 'Question'),
        ('confession', 'Confession'),
        ('opinion', 'Opinion'),
        ('support', 'Support'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='anonymous_posts')
    post_type = models.CharField(max_length=20, choices=POST_TYPES)
    content = models.TextField(max_length=2000)
    anonymous_id = models.CharField(max_length=50)
    tags = models.JSONField(default=list)
    likes = models.IntegerField(default=0)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Anonymous {self.post_type} by {self.anonymous_id}"

class AnonymousComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(AnonymousPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=1000)
    anonymous_id = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Comment by {self.anonymous_id}"

# Move AnonymousChatUser BEFORE AnonymousChatRoom
class AnonymousChatUser(models.Model):
    """Store anonymous identity for users in each chat"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_room = models.ForeignKey('AnonymousChatRoom', on_delete=models.CASCADE, related_name='chat_users')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    anonymous_id = models.CharField(max_length=50)
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['chat_room', 'user']
    
    def __str__(self):
        return f"{self.anonymous_id} in {self.chat_room.id}"

class AnonymousChatRoom(models.Model):
    """Anonymous chat room between users"""
    ROOM_TYPES = [
        ('private', 'Private Chat'),
        ('group', 'Group Chat'),
        ('expert', 'Expert Chat'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES, default='private')
    room_name = models.CharField(max_length=200, blank=True)
    
    # Participants (for private chat, 2 users)
    participants = models.ManyToManyField(User, related_name='anonymous_chat_rooms')
    
    # For group chats
    group_name = models.CharField(max_length=200, blank=True)
    group_avatar = models.ImageField(upload_to='group_avatars/', null=True, blank=True)
    
    # For expert chats
    expert = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='expert_chat_rooms')
    expert_anonymous_id = models.CharField(max_length=50, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    last_message_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"ChatRoom: {self.room_name or str(self.id)}"
    
    def get_anonymous_id(self, user):
        """Get anonymous ID for a user in this chat"""
        anonymous_id, created = AnonymousChatUser.objects.get_or_create(
            chat_room=self,
            user=user,
            defaults={'anonymous_id': f"User_{random.randint(10000, 99999)}"}
        )
        return anonymous_id.anonymous_id

class AnonymousChatMessage(models.Model):
    """Messages in anonymous chat"""
    MESSAGE_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('file', 'File'),
        ('voice', 'Voice'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_room = models.ForeignKey(AnonymousChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='anonymous_messages')
    sender_anonymous_id = models.CharField(max_length=50)
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='text')
    content = models.TextField()
    media_url = models.URLField(blank=True, null=True)
    
    # Status
    is_read = models.BooleanField(default=False)
    read_by = models.ManyToManyField(User, related_name='read_messages', blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.sender_anonymous_id}: {self.content[:50]}"

class AnonymousPoll(models.Model):
    """Anonymous polls in chat rooms"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_room = models.ForeignKey(AnonymousChatRoom, on_delete=models.CASCADE, related_name='polls')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.CharField(max_length=500)
    options = models.JSONField(default=list)
    votes = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.question
    
    def has_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at

class AnonymousPollVote(models.Model):
    """Votes on anonymous polls"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    poll = models.ForeignKey(AnonymousPoll, on_delete=models.CASCADE, related_name='votes_cast')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    selected_option = models.IntegerField()
    voted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['poll', 'user']