from django.contrib import admin
from .models import Donation

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ['id', 'amount', 'name', 'email', 'is_anonymous', 'created_at']
    list_filter = ['is_anonymous', 'donation_type', 'created_at']
    search_fields = ['name', 'email', 'phone']
    readonly_fields = ['created_at']