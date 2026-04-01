from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

User = get_user_model()

class Counselor(models.Model):
    """Counselor/Expert profile"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='counselor_profile')
    
    # Professional details
    specialization = models.CharField(max_length=200)
    qualifications = models.TextField()
    experience_years = models.IntegerField()
    languages = models.JSONField(default=list)  # ['English', 'Hindi', 'Malayalam']
    
    # Consultation details
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
    free_initial_session = models.BooleanField(default=False)
    session_duration = models.IntegerField(default=60)  # minutes
    
    # Availability
    available_days = models.JSONField(default=list)  # ['monday', 'wednesday', 'friday']
    available_time_start = models.TimeField(null=True, blank=True)
    available_time_end = models.TimeField(null=True, blank=True)
    is_available = models.BooleanField(default=True)
    
    # Ratings
    rating = models.FloatField(default=0.0)
    total_reviews = models.IntegerField(default=0)
    total_sessions = models.IntegerField(default=0)
    
    # Verification
    is_verified = models.BooleanField(default=False)
    verified_documents = models.FileField(upload_to='counselor_docs/', null=True, blank=True)
    
    # Bio
    bio = models.TextField()
    profile_picture = models.ImageField(upload_to='counselors/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Dr. {self.user.display_name} - {self.specialization}"
    
    def update_rating(self):
        """Update counselor rating based on reviews"""
        from .models import SessionReview
        reviews = SessionReview.objects.filter(session__counselor=self)
        if reviews.exists():
            self.rating = reviews.aggregate(models.Avg('rating'))['rating__avg']
            self.total_reviews = reviews.count()
            self.save()

class CounselingSession(models.Model):
    """Booking session with counselor"""
    SESSION_TYPES = [
        ('chat', 'Text Chat'),
        ('audio', 'Audio Call'),
        ('video', 'Video Call'),
        ('in_person', 'In-Person'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('scheduled', 'Scheduled'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('missed', 'Missed'),
        ('refunded', 'Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='counseling_sessions')
    counselor = models.ForeignKey(Counselor, on_delete=models.CASCADE, related_name='sessions')
    
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES, default='chat')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Schedule
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    duration_minutes = models.IntegerField(default=60)
    
    # Payment
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_id = models.CharField(max_length=100, blank=True, null=True)
    payment_status = models.BooleanField(default=False)
    
    # Session details
    user_notes = models.TextField(blank=True, help_text="What would you like to discuss?")
    counselor_notes = models.TextField(blank=True)
    meeting_link = models.URLField(blank=True, null=True)
    
    # Timestamps
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-scheduled_date', '-scheduled_time']
    
    def __str__(self):
        return f"Session with {self.counselor.user.display_name} on {self.scheduled_date}"

class SessionReview(models.Model):
    """Review for completed sessions"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.OneToOneField(CounselingSession, on_delete=models.CASCADE, related_name='review')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    counselor = models.ForeignKey(Counselor, on_delete=models.CASCADE, related_name='reviews')
    
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    review = models.TextField(max_length=500)
    is_anonymous = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.counselor.update_rating()
    
    def __str__(self):
        return f"Rating: {self.rating} for {self.counselor.user.display_name}"

class CounselorAvailability(models.Model):
    """Counselor availability slots"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    counselor = models.ForeignKey(Counselor, on_delete=models.CASCADE, related_name='availabilities')
    
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)
    booked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['counselor', 'date', 'start_time']
    
    def __str__(self):
        return f"{self.counselor.user.display_name} - {self.date} {self.start_time}"

class CrisisHelpline(models.Model):
    """Emergency crisis helpline numbers"""
    CATEGORY_CHOICES = [
        ('mental', 'Mental Health'),
        ('domestic', 'Domestic Violence'),
        ('suicide', 'Suicide Prevention'),
        ('women', 'Women Helpline'),
        ('general', 'General'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    number = models.CharField(max_length=20)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    is_24x7 = models.BooleanField(default=True)
    operating_hours = models.CharField(max_length=100, blank=True)
    priority = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name}: {self.number}"