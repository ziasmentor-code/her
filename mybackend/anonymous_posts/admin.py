from django.contrib import admin
from .models import AnonymousPost, AnonymousComment

@admin.register(AnonymousPost)
class AnonymousPostAdmin(admin.ModelAdmin):
    list_display = ['id', 'anonymous_id', 'post_type', 'content', 'likes', 'created_at']
    list_filter = ['post_type', 'is_approved', 'created_at']
    search_fields = ['content']

@admin.register(AnonymousComment)
class AnonymousCommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'anonymous_id', 'post', 'created_at']