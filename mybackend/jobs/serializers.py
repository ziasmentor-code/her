from rest_framework import serializers
from .models import (
    JobCategory, Employer, JobListing, 
    JobApplication, SavedJob, JobAlert
)

class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = '__all__'

class EmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class JobListingSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.company_name', read_only=True)
    employer_logo = serializers.ImageField(source='employer.company_logo', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_applied = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    
    class Meta:
        model = JobListing
        fields = '__all__'
        read_only_fields = ['id', 'view_count', 'created_at', 'updated_at']
    
    def get_is_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return JobApplication.objects.filter(job=obj, applicant=request.user).exists()
        return False
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(job=obj, user=request.user).exists()
        return False

class JobApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.display_name', read_only=True)
    applicant_email = serializers.EmailField(source='applicant.email', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    employer_name = serializers.CharField(source='job.employer.company_name', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['id', 'applied_at', 'updated_at']

class SavedJobSerializer(serializers.ModelSerializer):
    job_details = JobListingSerializer(source='job', read_only=True)
    
    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'job_details', 'saved_at']
        read_only_fields = ['id', 'saved_at']

class JobAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobAlert
        fields = '__all__'
        read_only_fields = ['id', 'created_at']