from django.db import models
from django.conf import settings
import uuid

class SOSAlert(models.Model):
    SOS_STATUS = [
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        db_column='user_id'
    )
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=SOS_STATUS, default='active')
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    location_address = models.TextField(default='', blank=True)
    triggered_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, default='')
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_alerts',
        db_column='resolved_by_id'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'safety_sosalert'
    
    def __str__(self):
        return f"SOS Alert - {self.created_at}"


class EmergencyContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        db_column='user_id'
    )
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, blank=True, null=True)  # Add null=True
    relationship = models.CharField(max_length=20, blank=True, null=True)  # Add null=True
    email = models.EmailField(blank=True, null=True)  # Already has null=True
    address = models.TextField(blank=True, null=True)  # Add null=True
    is_primary = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'safety_emergencycontact'
    
    class Meta:
        db_table = 'safety_emergencycontact'
        unique_together = [['user', 'phone_number']]
    
    def __str__(self):
        return self.name


class EmergencyResource(models.Model):
    RESOURCE_TYPE = [
        ('helpline', 'Helpline'),
        ('police', 'Police'),
        ('hospital', 'Hospital'),
        ('shelter', 'Shelter'),
        ('counseling', 'Counseling'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=RESOURCE_TYPE)
    phone = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_national = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'safety_emergencyresource'
    
    def __str__(self):
        return self.name