from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'display_name', 'role', 'is_verified')
    list_filter = ('role', 'is_verified', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone_number', 'display_name', 
                                        'profile_picture', 'bio', 'is_verified')}),
    )

admin.site.register(User, CustomUserAdmin)