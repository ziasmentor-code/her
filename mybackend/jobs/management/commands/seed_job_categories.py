from django.core.management.base import BaseCommand
from jobs.models import JobCategory

class Command(BaseCommand):
    help = 'Seed job categories'

    def handle(self, *args, **kwargs):
        categories = [
            'Technology', 'Healthcare', 'Education', 'Business',
            'Marketing', 'Design', 'Sales', 'Finance',
            'Hospitality', 'Administration', 'Human Resources',
            'Customer Service', 'Engineering', 'Legal', 'Media'
        ]
        
        count = 0
        for cat in categories:
            obj, created = JobCategory.objects.get_or_create(name=cat)
            if created:
                count += 1
                self.stdout.write(f"✓ Created: {cat}")
        
        self.stdout.write(self.style.SUCCESS(f"\n✅ Successfully added {count} job categories!"))
        self.stdout.write(f"📋 Total categories: {JobCategory.objects.count()}")