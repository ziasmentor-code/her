from django.contrib import admin
from .models import Counselor, CounselingSession, SessionReview, CounselorAvailability, CrisisHelpline

@admin.register(Counselor)
class CounselorAdmin(admin.ModelAdmin):
    list_display = ['user', 'specialization', 'experience_years', 'consultation_fee', 'rating', 'is_verified']
    list_filter = ['specialization', 'is_verified', 'is_available']
    search_fields = ['user__username', 'user__display_name', 'specialization']

@admin.register(CounselingSession)
class CounselingSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'counselor', 'scheduled_date', 'status', 'payment_status']
    list_filter = ['status', 'payment_status', 'session_type']
    search_fields = ['user__username', 'counselor__user__username']

@admin.register(SessionReview)
class SessionReviewAdmin(admin.ModelAdmin):
    list_display = ['session', 'user', 'rating', 'created_at']
    list_filter = ['rating']

@admin.register(CounselorAvailability)
class CounselorAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['counselor', 'date', 'start_time', 'end_time', 'is_booked']
    list_filter = ['is_booked', 'date']

@admin.register(CrisisHelpline)
class CrisisHelplineAdmin(admin.ModelAdmin):
    list_display = ['name', 'number', 'category', 'is_24x7', 'priority']
    list_filter = ['category', 'is_24x7']