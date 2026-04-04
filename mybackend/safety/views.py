from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import SOSAlert, EmergencyContact, EmergencyResource
from .serializers import (
    SOSAlertSerializer, SOSCreateSerializer, 
    EmergencyContactSerializer, EmergencyResourceSerializer
)

class SOSAlertViewSet(viewsets.ModelViewSet):
    serializer_class = SOSAlertSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SOSAlert.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def create_alert(self, request):
        serializer = SOSCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            alert = SOSAlert.objects.create(
                user=request.user,
                message=serializer.validated_data.get('message', ''),
                status='active',
                location_address=serializer.validated_data.get('location_address', 'Unknown'),
                latitude=serializer.validated_data.get('latitude'),
                longitude=serializer.validated_data.get('longitude'),
                triggered_at=timezone.now(),
                notes=''
            )
            
            return Response({
                'success': True,
                'message': 'SOS Alert sent successfully!',
                'alert': SOSAlertSerializer(alert).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        alert = self.get_object()
        alert.status = 'resolved'
        alert.resolved_at = timezone.now()
        alert.save()
        return Response({'success': True, 'message': 'SOS alert resolved'})


class EmergencyContactViewSet(viewsets.ModelViewSet):
    serializer_class = EmergencyContactSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        if EmergencyContact.objects.filter(user=self.request.user).count() == 0:
            serializer.save(user=self.request.user, is_primary=True)
        else:
            serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def set_primary(self, request):
        contact_id = request.data.get('contact_id')
        try:
            EmergencyContact.objects.filter(user=self.request.user).update(is_primary=False)
            contact = EmergencyContact.objects.get(id=contact_id, user=self.request.user)
            contact.is_primary = True
            contact.save()
            return Response({'success': True, 'message': 'Primary contact updated'})
        except EmergencyContact.DoesNotExist:
            return Response({'error': 'Contact not found'}, status=404)


class EmergencyResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EmergencyResource.objects.all()
    serializer_class = EmergencyResourceSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        resource_type = request.query_params.get('type')
        if resource_type:
            resources = self.queryset.filter(type=resource_type)
            return Response(EmergencyResourceSerializer(resources, many=True).data)
        return Response({'error': 'Type parameter required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def national_helplines(self, request):
        resources = self.queryset.filter(is_national=True)
        return Response(EmergencyResourceSerializer(resources, many=True).data)