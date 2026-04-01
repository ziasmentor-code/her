from django.contrib import admin
from .models import (
    JobCategory, Employer, JobListing, 
    JobApplication, SavedJob, JobAlert
)

@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    list_editable = ['is_active']

@admin.register(Employer)
class EmployerAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'user', 'industry', 'location', 'is_verified', 'created_at']
    list_filter = ['industry', 'is_verified', 'company_size']
    search_fields = ['company_name', 'user__display_name', 'location']
    list_editable = ['is_verified']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = ['title', 'employer', 'category', 'job_type', 'location', 'is_active', 'is_featured', 'created_at']  # Added is_featured
    list_filter = ['job_type', 'experience_level', 'work_mode', 'is_active', 'is_featured', 'category']
    search_fields = ['title', 'description', 'employer__company_name', 'location']
    list_editable = ['is_active', 'is_featured']  # Now both are in list_display
    readonly_fields = ['view_count', 'created_at', 'updated_at']

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant', 'job', 'status', 'applied_at', 'expected_salary']
    list_filter = ['status', 'applied_at']
    search_fields = ['applicant__display_name', 'job__title', 'cover_letter']
    list_editable = ['status']
    readonly_fields = ['applied_at', 'updated_at']

@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ['user', 'job', 'saved_at']
    list_filter = ['saved_at']
    search_fields = ['user__display_name', 'job__title']
    readonly_fields = ['saved_at']

@admin.register(JobAlert)
class JobAlertAdmin(admin.ModelAdmin):
    list_display = ['user', 'category', 'job_type', 'location', 'frequency', 'is_active', 'created_at']
    list_filter = ['frequency', 'is_active', 'job_type']
    search_fields = ['user__display_name', 'keywords', 'location']
    list_editable = ['is_active']
    readonly_fields = ['created_at']