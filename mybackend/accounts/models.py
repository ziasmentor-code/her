from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    class Role(models.TextChoices):
        USER = 'USER', 'User'
        MENTOR = 'MENTOR', 'Mentor'
        DOCTOR = 'DOCTOR', 'Doctor'
        ADMIN = 'ADMIN', 'Admin'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.USER)
    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    display_name = models.CharField(max_length=100, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    bio = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    aadhaar_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    
    # Professional fields
    specialization = models.CharField(max_length=200, blank=True, null=True)
    years_of_experience = models.IntegerField(default=0)
    professional_license = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_user(self):
        return self.role == self.Role.USER
    
    @property
    def is_mentor(self):
        return self.role == self.Role.MENTOR
    
    @property
    def is_doctor(self):
        return self.role == self.Role.DOCTOR
    
    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN or self.is_superuser

class MentorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mentor_profile')
    expertise_areas = models.JSONField(default=list)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    available_days = models.JSONField(default=list)
    available_time_start = models.TimeField(null=True, blank=True)
    available_time_end = models.TimeField(null=True, blank=True)
    total_sessions = models.IntegerField(default=0)
    rating = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Mentor: {self.user.username}"

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    medical_registration_number = models.CharField(max_length=50, unique=True)
    clinic_name = models.CharField(max_length=200, blank=True)
    clinic_address = models.TextField(blank=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    available_for_emergency = models.BooleanField(default=False)
    specializations = models.JSONField(default=list)
    consultation_mode = models.JSONField(default=list)
    total_patients = models.IntegerField(default=0)
    rating = models.FloatField(default=0.0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Dr. {self.user.username}"