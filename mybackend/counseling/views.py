from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Counselor, CounselingSession, SessionReview, CounselorAvailability, CrisisHelpline
from .serializers import (
    CounselorSerializer, CounselorListSerializer, CounselingSessionSerializer,
    CreateSessionSerializer, SessionReviewSerializer, CounselorAvailabilitySerializer,
    CrisisHelplineSerializer
)
from accounts.permissions import IsUser, IsMentor

class CounselorViewSet(viewsets.ModelViewSet):
    queryset = Counselor.objects.filter(is_available=True, is_verified=True)
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CounselorListSerializer
        return CounselorSerializer
    
    @action(detail=False, methods=['get'])
    def by_specialization(self, request):
        specialization = request.query_params.get('specialization')
        if specialization:
            counselors = self.get_queryset().filter(specialization__icontains=specialization)
            serializer = self.get_serializer(counselors, many=True)
            return Response(serializer.data)
        return Response({'error': 'Specialization required'}, status=400)
    
    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        counselor = self.get_object()
        availabilities = CounselorAvailability.objects.filter(
            counselor=counselor,
            date__gte=timezone.now().date(),
            is_booked=False
        )
        serializer = CounselorAvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)

class CounselingSessionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_mentor:
            return CounselingSession.objects.filter(counselor__user=user)
        return CounselingSession.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateSessionSerializer
        return CounselingSessionSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user, payment_status=False)
    
    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        session = self.get_object()
        session.payment_status = True
        session.status = 'scheduled'
        session.payment_id = request.data.get('payment_id')
        session.save()
        
        # Book the availability slot
        CounselorAvailability.objects.filter(
            counselor=session.counselor,
            date=session.scheduled_date,
            start_time=session.scheduled_time
        ).update(is_booked=True, booked_by=session.user)
        
        return Response({'status': 'Payment confirmed', 'session_id': session.id})
    
    @action(detail=True, methods=['post'])
    def start_session(self, request, pk=None):
        session = self.get_object()
        if session.status == 'scheduled':
            session.status = 'ongoing'
            session.started_at = timezone.now()
            session.save()
            return Response({'status': 'Session started'})
        return Response({'error': 'Session cannot be started'}, status=400)
    
    @action(detail=True, methods=['post'])
    def end_session(self, request, pk=None):
        session = self.get_object()
        if session.status == 'ongoing':
            session.status = 'completed'
            session.ended_at = timezone.now()
            session.save()
            session.counselor.total_sessions += 1
            session.counselor.save()
            return Response({'status': 'Session completed'})
        return Response({'error': 'Session cannot be ended'}, status=400)
    
    @action(detail=True, methods=['post'])
    def cancel_session(self, request, pk=None):
        session = self.get_object()
        if session.status in ['pending', 'scheduled']:
            session.status = 'cancelled'
            session.save()
            return Response({'status': 'Session cancelled'})
        return Response({'error': 'Session cannot be cancelled'}, status=400)

class SessionReviewViewSet(viewsets.ModelViewSet):
    serializer_class = SessionReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SessionReview.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        session_id = self.request.data.get('session')
        session = CounselingSession.objects.get(id=session_id)
        serializer.save(
            user=self.request.user,
            counselor=session.counselor
        )

class CrisisHelplineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CrisisHelpline.objects.filter(is_active=True)
    serializer_class = CrisisHelplineSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category')
        if category:
            helplines = self.get_queryset().filter(category=category)
            serializer = self.get_serializer(helplines, many=True)
            return Response(serializer.data)
        return Response({'error': 'Category required'}, status=400)