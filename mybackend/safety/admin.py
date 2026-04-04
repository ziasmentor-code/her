from django.contrib import admin
from .models import SOSAlert, EmergencyContact, EmergencyResource

@admin.register(SOSAlert)
class SOSAlertAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'message']
    readonly_fields = ['created_at', 'triggered_at']

@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'phone_number', 'relationship', 'is_primary']  # Changed 'phone' to 'phone_number'
    list_filter = ['is_primary', 'is_active']
    search_fields = ['name', 'phone_number', 'email']

@admin.register(EmergencyResource)
class EmergencyResourceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'type', 'phone', 'is_national']
    list_filter = ['type', 'is_national']
    search_fields = ['name', 'phone']