from rest_framework import serializers
from .models import Counselor, CounselingSession, SessionReview, CounselorAvailability, CrisisHelpline
from accounts.serializers import UserSerializer

class CounselorSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Counselor
        fields = '__all__'
        read_only_fields = ['id', 'rating', 'total_reviews', 'total_sessions', 'created_at', 'updated_at']

class CounselorListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing counselors"""
    name = serializers.CharField(source='user.display_name', read_only=True)
    profile_pic = serializers.ImageField(source='profile_picture', read_only=True)
    
    class Meta:
        model = Counselor
        fields = ['id', 'name', 'specialization', 'experience_years', 
                  'consultation_fee', 'rating', 'total_reviews', 
                  'profile_pic', 'is_available']

class CounselingSessionSerializer(serializers.ModelSerializer):
    counselor_details = CounselorListSerializer(source='counselor', read_only=True)
    user_name = serializers.CharField(source='user.display_name', read_only=True)
    
    class Meta:
        model = CounselingSession
        fields = '__all__'
        read_only_fields = ['id', 'payment_status', 'created_at', 'started_at', 'ended_at']

class CreateSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounselingSession
        fields = ['counselor', 'session_type', 'scheduled_date', 
                  'scheduled_time', 'duration_minutes', 'user_notes']

class SessionReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.display_name', read_only=True)
    
    class Meta:
        model = SessionReview
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class CounselorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CounselorAvailability
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class CrisisHelplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrisisHelpline
        fields = '__all__'