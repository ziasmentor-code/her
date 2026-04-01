from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import (
    Helpline, EmergencyContact, SOSAlert, 
    SafetyTip, LocationShare, SafetyCheckIn
)
from .serializers import (
    HelplineSerializer, EmergencyContactSerializer, SOSAlertSerializer,
    SafetyTipSerializer, LocationShareSerializer, SafetyCheckInSerializer
)

class HelplineViewSet(viewsets.ModelViewSet):
    queryset = Helpline.objects.filter(is_active=True)
    serializer_class = HelplineSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category')
        if category:
            helplines = self.get_queryset().filter(category=category)
            serializer = self.get_serializer(helplines, many=True)
            return Response(serializer.data)
        return Response({'error': 'Category required'}, status=400)

class EmergencyContactViewSet(viewsets.ModelViewSet):
    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SOSAlertViewSet(viewsets.ModelViewSet):
    serializer_class = SOSAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SOSAlert.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def trigger(self, request):
        """Trigger SOS alert with location"""
        serializer = self.get_serializer(data={
            'user': request.user.id,
            'latitude': request.data.get('latitude'),
            'longitude': request.data.get('longitude'),
            'location_address': request.data.get('location_address', ''),
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Send notifications to emergency contacts (implement later)
        # send_sms_to_contacts(request.user, serializer.data)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        alert = self.get_object()
        alert.status = 'resolved'
        alert.resolved_at = timezone.now()
        alert.resolved_by = request.user
        alert.save()
        return Response({'status': 'resolved'})

class SafetyTipViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SafetyTip.objects.all()
    serializer_class = SafetyTipSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        tip = self.get_object()
        tip.view_count += 1
        tip.save()
        return Response({'view_count': tip.view_count})
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        tips = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(tips, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category')
        if category:
            tips = self.get_queryset().filter(category=category)
            serializer = self.get_serializer(tips, many=True)
            return Response(serializer.data)
        return Response({'error': 'Category required'}, status=400)

class LocationShareViewSet(viewsets.ModelViewSet):
    serializer_class = LocationShareSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return LocationShare.objects.filter(
            Q(user=self.request.user) | Q(shared_with=self.request.user)
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SafetyCheckInViewSet(viewsets.ModelViewSet):
    serializer_class = SafetyCheckInSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SafetyCheckIn.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)