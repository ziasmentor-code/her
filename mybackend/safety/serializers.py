from rest_framework import serializers
from .models import (
    Helpline, EmergencyContact, SOSAlert, 
    SafetyTip, LocationShare, SafetyCheckIn
)

class HelplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Helpline
        fields = '__all__'

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class SOSAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SOSAlert
        fields = '__all__'
        read_only_fields = ['id', 'triggered_at', 'resolved_at']

class SafetyTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyTip
        fields = '__all__'
        read_only_fields = ['id', 'view_count', 'created_at']

class LocationShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationShare
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class SafetyCheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyCheckIn
        fields = '__all__'
        read_only_fields = ['id', 'responded_at']