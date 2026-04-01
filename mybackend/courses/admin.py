from django.contrib import admin
from .models import (
    CourseCategory, Course, Lesson, 
    Enrollment, LessonProgress, Review, Certificate
)

@admin.register(CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    list_editable = ['is_active']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'level', 'price', 'is_free', 'is_published', 'students_enrolled', 'rating']
    list_filter = ['level', 'is_published', 'is_free', 'category']
    search_fields = ['title', 'description', 'instructor__display_name']
    list_editable = ['is_published']
    readonly_fields = ['students_enrolled', 'rating', 'total_reviews']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'subtitle', 'description', 'category', 'thumbnail')
        }),
        ('Course Details', {
            'fields': ('level', 'duration_hours', 'lessons_count', 'price', 'is_free', 'discount_price')
        }),
        ('Instructor', {
            'fields': ('instructor', 'instructor_bio')
        }),
        ('Content', {
            'fields': ('what_you_will_learn', 'requirements', 'target_audience')
        }),
        ('Status', {
            'fields': ('is_published', 'is_featured')
        }),
        ('Statistics', {
            'fields': ('students_enrolled', 'rating', 'total_reviews', 'view_count')
        }),
    )

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'video_duration', 'is_preview']
    list_filter = ['course', 'is_preview']
    search_fields = ['title', 'description']
    list_editable = ['order', 'is_preview']
    ordering = ['course', 'order']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'progress_percentage', 'status', 'is_paid', 'enrolled_at']
    list_filter = ['status', 'is_paid', 'course']
    search_fields = ['user__display_name', 'user__username', 'course__title']
    readonly_fields = ['enrolled_at', 'completed_at', 'progress_percentage']
    list_editable = ['status']

@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ['enrollment', 'lesson', 'is_completed', 'completed_at']
    list_filter = ['is_completed']
    search_fields = ['enrollment__user__display_name', 'lesson__title']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'rating', 'comment_preview', 'created_at', 'is_approved']
    list_filter = ['rating', 'is_approved', 'course']
    search_fields = ['user__display_name', 'course__title', 'comment']
    list_editable = ['is_approved']
    
    def comment_preview(self, obj):
        return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
    comment_preview.short_description = 'Comment'

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'certificate_number', 'issued_at']
    list_filter = ['course']
    search_fields = ['user__display_name', 'course__title', 'certificate_number']
    readonly_fields = ['certificate_number', 'issued_at']