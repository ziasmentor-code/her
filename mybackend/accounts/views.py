from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import MentorProfile, DoctorProfile
from .serializers import (
    UserSerializer, RegisterSerializer, MentorSerializer, 
    DoctorSerializer
)
from .permissions import IsAdmin, IsMentor, IsDoctor, IsUser

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class MentorViewSet(viewsets.ModelViewSet):
    queryset = MentorProfile.objects.filter(is_active=True)
    serializer_class = MentorSerializer
    permission_classes = [permissions.IsAuthenticated, IsMentor]

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.filter(is_available=True)
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctor]