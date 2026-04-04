from rest_framework import serializers
from .models import SOSAlert, EmergencyContact, EmergencyResource

class SOSAlertSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = SOSAlert
        fields = ['id', 'user', 'user_name', 'message', 'status', 'latitude', 
                  'longitude', 'location_address', 'created_at', 'triggered_at']
        read_only_fields = ['status', 'created_at', 'triggered_at']


class SOSCreateSerializer(serializers.Serializer):
    message = serializers.CharField(required=False, allow_blank=True)
    latitude = serializers.DecimalField(max_digits=10, decimal_places=8, required=False)
    longitude = serializers.DecimalField(max_digits=11, decimal_places=8, required=False)
    location_address = serializers.CharField(required=False, allow_blank=True)


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = ['id', 'name', 'phone_number', 'alternate_phone', 'relationship', 
                  'email', 'address', 'is_primary', 'created_at']


class EmergencyResourceSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = EmergencyResource
        fields = '__all__'