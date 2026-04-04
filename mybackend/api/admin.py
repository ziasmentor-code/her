# api/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Job, Course

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'status', 'created_at')
    list_filter = ('role', 'status')
    search_fields = ('username', 'email')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'status', 'phone', 'address', 'profile_image')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(Job)
admin.site.register(Course)