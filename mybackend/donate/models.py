from django.db import models
from django.conf import settings  # This is important!
from django.utils import timezone

class Donation(models.Model):
    DONATION_TYPE = [
        ('one_time', 'One Time'),
        ('monthly', 'Monthly'),
    ]
    
    # Use settings.AUTH_USER_MODEL instead of User directly
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Changed from 'User' to settings.AUTH_USER_MODEL
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='donations'
    )
    anonymous_name = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_type = models.CharField(max_length=20, choices=DONATION_TYPE, default='one_time')
    message = models.TextField(blank=True, null=True)
    email = models.EmailField()
    name = models.CharField(max_length=200, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    is_anonymous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        if self.is_anonymous:
            return f"Anonymous Donation - ₹{self.amount}"
        return f"{self.name or 'Anonymous'} - ₹{self.amount}"