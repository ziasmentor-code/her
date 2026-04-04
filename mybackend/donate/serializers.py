from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['id', 'amount', 'donation_type', 'message', 'email', 'name', 'phone', 'is_anonymous', 'created_at']
        read_only_fields = ['created_at']

class DonationCreateSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=10)
    donation_type = serializers.ChoiceField(choices=['one_time', 'monthly'])
    message = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField()
    name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    is_anonymous = serializers.BooleanField(default=False)