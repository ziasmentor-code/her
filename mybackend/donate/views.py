from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Sum
from .models import Donation
from .serializers import DonationSerializer
import logging

logger = logging.getLogger(__name__)

class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def create_donation(self, request):
        """Create a donation (demo - no actual payment)"""
        try:
            logger.info(f"Received donation data: {request.data}")
            
            # Get data from request
            amount = request.data.get('amount')
            donation_type = request.data.get('donation_type', 'one_time')
            message = request.data.get('message', '')
            email = request.data.get('email')
            name = request.data.get('name', '')
            phone = request.data.get('phone', '')
            is_anonymous = request.data.get('is_anonymous', False)
            
            # Validate required fields
            if not amount:
                return Response({'error': 'Amount is required'}, status=400)
            
            if not email:
                return Response({'error': 'Email is required'}, status=400)
            
            # Create donation
            donation = Donation.objects.create(
                user=request.user if request.user.is_authenticated else None,
                amount=amount,
                donation_type=donation_type,
                message=message,
                email=email,
                name=name,
                phone=phone,
                is_anonymous=is_anonymous
            )
            
            logger.info(f"Donation created successfully: {donation.id}")
            
            return Response({
                'success': True,
                'message': 'Thank you for your generous donation! 🙏',
                'donation': DonationSerializer(donation).data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error creating donation: {str(e)}")
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get donation statistics"""
        total_donations = Donation.objects.count()
        total_amount = Donation.objects.aggregate(total=Sum('amount'))['total'] or 0
        
        return Response({
            'total_donations': total_donations,
            'total_amount': float(total_amount),
            'impact_score': int(total_amount // 100) if total_amount else 0
        })