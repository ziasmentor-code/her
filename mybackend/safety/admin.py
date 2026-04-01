from django.contrib import admin
from .models import (
    Helpline, EmergencyContact, SOSAlert, 
    SafetyTip, LocationShare, SafetyCheckIn
)

@admin.register(Helpline)
class HelplineAdmin(admin.ModelAdmin):
    list_display = ['name', 'number', 'category', 'is_24x7', 'priority']
    list_filter = ['category', 'is_24x7', 'is_active']
    search_fields = ['name', 'number']

@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'phone_number', 'relationship', 'is_primary']
    list_filter = ['relationship', 'is_primary']
    search_fields = ['user__username', 'name', 'phone_number']

@admin.register(SOSAlert)
class SOSAlertAdmin(admin.ModelAdmin):
    list_display = ['user', 'status', 'triggered_at', 'resolved_at']
    list_filter = ['status']
    search_fields = ['user__username']

@admin.register(SafetyTip)
class SafetyTipAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_featured', 'view_count']
    list_filter = ['category', 'is_featured']
    search_fields = ['title', 'content']

@admin.register(LocationShare)
class LocationShareAdmin(admin.ModelAdmin):
    list_display = ['user', 'shared_with', 'expires_at', 'is_active']
    list_filter = ['is_active']

@admin.register(SafetyCheckIn)
class SafetyCheckInAdmin(admin.ModelAdmin):
    list_display = ['user', 'status', 'scheduled_time', 'responded_at']
    list_filter = ['status']