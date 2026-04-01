from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Helpline(models.Model):
    """Emergency helpline numbers"""
    CATEGORY_CHOICES = [
        ('police', 'Police'),
        ('women', 'Women Helpline'),
        ('ambulance', 'Ambulance'),
        ('child', 'Child Helpline'),
        ('mental', 'Mental Health'),
        ('general', 'General'),
        ('fire', 'Fire Station'),
        ('disaster', 'Disaster Management'),
        ('legal', 'Legal Aid'),
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
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['priority', 'name']
    
    def __str__(self):
        return f"{self.name}: {self.number}"

class EmergencyContact(models.Model):
    """User's personal emergency contacts"""
    RELATIONSHIP_CHOICES = [
        ('parent', 'Parent'),
        ('spouse', 'Spouse'),
        ('sibling', 'Sibling'),
        ('friend', 'Friend'),
        ('relative', 'Relative'),
        ('neighbor', 'Neighbor'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emergency_contacts')
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, blank=True)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    is_primary = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_primary', 'name']
        unique_together = ['user', 'phone_number']
    
    def save(self, *args, **kwargs):
        if self.is_primary:
            # Set all other contacts of this user as non-primary
            EmergencyContact.objects.filter(user=self.user, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} ({self.get_relationship_display()}) - {self.phone_number}"

class SOSAlert(models.Model):
    """SOS alerts triggered by users"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('cancelled', 'Cancelled'),
        ('false_alarm', 'False Alarm'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sos_alerts')
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    location_address = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    triggered_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_alerts')
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-triggered_at']
    
    def __str__(self):
        return f"SOS by {self.user.username} at {self.triggered_at}"

class SafetyTip(models.Model):
    """Daily safety tips and guidelines"""
    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('travel', 'Travel Safety'),
        ('online', 'Online Safety'),
        ('workplace', 'Workplace Safety'),
        ('home', 'Home Safety'),
        ('emergency', 'Emergency Response'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='safety_tips/', null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    view_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
    
    def __str__(self):
        return self.title

class LocationShare(models.Model):
    """Real-time location sharing for safety"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='location_shares')
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_locations')
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} sharing with {self.shared_with.username}"

class SafetyCheckIn(models.Model):
    """Regular safety check-ins"""
    STATUS_CHOICES = [
        ('safe', 'Safe'),
        ('not_safe', 'Not Safe'),
        ('no_response', 'No Response'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='check_ins')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    location = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    scheduled_time = models.DateTimeField()
    responded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-scheduled_time']
    
    def __str__(self):
        return f"{self.user.username} - {self.status} at {self.scheduled_time}"