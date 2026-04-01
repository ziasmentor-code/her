from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Avg
from django.utils import timezone
from .models import (
    CourseCategory, Course, Lesson, Enrollment, 
    LessonProgress, Review, Certificate
)
from .serializers import (
    CourseCategorySerializer, CourseListSerializer, CourseDetailSerializer,
    LessonSerializer, EnrollmentSerializer, LessonProgressSerializer,
    ReviewSerializer, CertificateSerializer
)

class CourseCategoryViewSet(viewsets.ModelViewSet):
    queryset = CourseCategory.objects.filter(is_active=True)
    serializer_class = CourseCategorySerializer
    permission_classes = [permissions.AllowAny]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(is_published=True)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'instructor__display_name']
    ordering_fields = ['created_at', 'price', 'rating', 'students_enrolled']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name__iexact=category)
        
        # Filter by level
        level = self.request.query_params.get('level')
        if level:
            queryset = queryset.filter(level=level)
        
        # Filter by price (free or paid)
        price_type = self.request.query_params.get('price_type')
        if price_type == 'free':
            queryset = queryset.filter(is_free=True)
        elif price_type == 'paid':
            queryset = queryset.filter(is_free=False)
        
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        course = self.get_object()
        
        # Check if already enrolled
        if Enrollment.objects.filter(user=request.user, course=course).exists():
            return Response({'error': 'Already enrolled'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if course is free or requires payment
        if course.is_free:
            enrollment = Enrollment.objects.create(
                user=request.user,
                course=course,
                is_paid=True,
                status='active'
            )
            course.students_enrolled += 1
            course.save()
            return Response({'message': 'Successfully enrolled!'})
        
        return Response({
            'message': 'Payment required',
            'amount': course.final_price,
            'course_id': str(course.id)
        }, status=status.HTTP_402_PAYMENT_REQUIRED)
    
    @action(detail=True, methods=['post'])
    def complete_lesson(self, request, pk=None):
        course = self.get_object()
        lesson_id = request.data.get('lesson_id')
        
        try:
            lesson = Lesson.objects.get(id=lesson_id, course=course)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found'}, status=404)
        
        enrollment = Enrollment.objects.get(user=request.user, course=course)
        
        # Mark lesson as completed
        progress, created = LessonProgress.objects.get_or_create(
            enrollment=enrollment,
            lesson=lesson,
            defaults={'is_completed': True, 'completed_at': timezone.now()}
        )
        
        if not created and not progress.is_completed:
            progress.is_completed = True
            progress.completed_at = timezone.now()
            progress.save()
        
        # Update enrollment progress
        total_lessons = course.lessons.count()
        completed_lessons = LessonProgress.objects.filter(
            enrollment=enrollment, is_completed=True
        ).count()
        
        enrollment.progress_percentage = int((completed_lessons / total_lessons) * 100)
        
        if enrollment.progress_percentage == 100:
            enrollment.status = 'completed'
            enrollment.completed_at = timezone.now()
            
            # Generate certificate
            Certificate.objects.get_or_create(
                user=request.user,
                course=course,
                enrollment=enrollment
            )
        
        enrollment.save()
        
        return Response({
            'progress': enrollment.progress_percentage,
            'is_completed': enrollment.progress_percentage == 100
        })
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        course = self.get_object()
        
        # Check if user is enrolled
        if not Enrollment.objects.filter(user=request.user, course=course).exists():
            return Response({'error': 'You must enroll to review'}, status=400)
        
        serializer = ReviewSerializer(data={
            'user': request.user.id,
            'course': course.id,
            'rating': request.data.get('rating'),
            'comment': request.data.get('comment')
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Update course rating
        avg_rating = Review.objects.filter(course=course).aggregate(Avg('rating'))['rating__avg']
        course.rating = avg_rating
        course.total_reviews = Review.objects.filter(course=course).count()
        course.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)

class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Certificate.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        certificate = self.get_object()
        # Return certificate PDF (implement PDF generation)
        return Response({'url': certificate.pdf_file.url if certificate.pdf_file else None})