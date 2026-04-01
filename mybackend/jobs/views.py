from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import JobCategory, Employer, JobListing, JobApplication, SavedJob, JobAlert
from .serializers import (
    JobCategorySerializer, EmployerSerializer, JobListingSerializer,
    JobApplicationSerializer, SavedJobSerializer, JobAlertSerializer
)
from accounts.permissions import IsUser, IsAdmin

# Add this if not already present
class JobCategoryViewSet(viewsets.ModelViewSet):
    queryset = JobCategory.objects.filter(is_active=True)
    serializer_class = JobCategorySerializer
    permission_classes = [permissions.AllowAny]

# ... rest of your views

class EmployerViewSet(viewsets.ModelViewSet):
    queryset = Employer.objects.filter(is_verified=True)
    serializer_class = EmployerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Employer.objects.all()
        return Employer.objects.filter(user=user)

class JobListingViewSet(viewsets.ModelViewSet):
    queryset = JobListing.objects.filter(is_active=True, application_deadline__gte=timezone.now().date())
    serializer_class = JobListingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location', 'employer__company_name']
    ordering_fields = ['created_at', 'salary_min', 'application_deadline']
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name__iexact=category)
        
        # Filter by job type
        job_type = self.request.query_params.get('job_type')
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        
        # Filter by work mode
        work_mode = self.request.query_params.get('work_mode')
        if work_mode:
            queryset = queryset.filter(work_mode=work_mode)
        
        # Filter by location
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Filter by experience level
        experience = self.request.query_params.get('experience')
        if experience:
            queryset = queryset.filter(experience_level=experience)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        job = self.get_object()
        
        # Check if already applied
        if JobApplication.objects.filter(job=job, applicant=request.user).exists():
            return Response({'error': 'Already applied for this job'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = JobApplicationSerializer(data={
            'job': job.id,
            'cover_letter': request.data.get('cover_letter'),
            'resume': request.data.get('resume'),
            'portfolio_url': request.data.get('portfolio_url'),
            'expected_salary': request.data.get('expected_salary')
        })
        serializer.is_valid(raise_exception=True)
        serializer.save(applicant=request.user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def save_job(self, request, pk=None):
        job = self.get_object()
        saved, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        if created:
            return Response({'message': 'Job saved successfully'})
        return Response({'message': 'Job already saved'})
    
    @action(detail=True, methods=['post'])
    def unsave_job(self, request, pk=None):
        job = self.get_object()
        SavedJob.objects.filter(user=request.user, job=job).delete()
        return Response({'message': 'Job removed from saved'})
    
    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        job = self.get_object()
        job.view_count += 1
        job.save()
        return Response({'view_count': job.view_count})

class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_mentor or user.is_admin:
            # Employers can see applications for their jobs
            return JobApplication.objects.filter(job__employer__user=user)
        return JobApplication.objects.filter(applicant=user)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            application.status = new_status
            application.employer_notes = request.data.get('notes', '')
            application.save()
            return Response({'status': application.status})
        return Response({'error': 'Status required'}, status=400)

class SavedJobViewSet(viewsets.ModelViewSet):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)

class JobAlertViewSet(viewsets.ModelViewSet):
    serializer_class = JobAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return JobAlert.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)