from rest_framework import serializers
from .models import (
    CourseCategory, Course, Lesson, Enrollment, 
    LessonProgress, Review, Certificate
)

class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class CourseListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing courses"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    instructor_name = serializers.CharField(source='instructor.display_name', read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'thumbnail', 'level', 'duration_hours', 
                  'students_enrolled', 'price', 'discount_price', 'rating', 
                  'category_name', 'instructor_name', 'is_free']

class CourseDetailSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    instructor_name = serializers.CharField(source='instructor.display_name', read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = '__all__'
    
    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(
                user=request.user, course=obj, status='active'
            ).exists()
        return False

class EnrollmentSerializer(serializers.ModelSerializer):
    course_details = CourseListSerializer(source='course', read_only=True)
    user_name = serializers.CharField(source='user.display_name', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ['id', 'enrolled_at', 'completed_at']

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.display_name', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class CertificateSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    user_name = serializers.CharField(source='user.display_name', read_only=True)
    
    class Meta:
        model = Certificate
        fields = '__all__'