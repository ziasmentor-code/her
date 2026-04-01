from django.core.management.base import BaseCommand
from counseling.models import CrisisHelpline

class Command(BaseCommand):
    help = 'Seed crisis helpline numbers'

    def handle(self, *args, **kwargs):
        helplines = [
            # Mental Health
            {'name': 'Mental Health Helpline', 'number': '104', 'category': 'mental', 'priority': 1},
            {'name': 'iCall', 'number': '9152987821', 'category': 'mental', 'priority': 1},
            {'name': 'Vandrevala Foundation', 'number': '9999666555', 'category': 'mental', 'priority': 2},
            {'name': 'Fortis Mental Health', 'number': '8376804102', 'category': 'mental', 'priority': 2},
            
            # Suicide Prevention
            {'name': 'Suicide Prevention Helpline', 'number': '9820466726', 'category': 'suicide', 'priority': 1},
            {'name': 'AASRA', 'number': '9820466726', 'category': 'suicide', 'priority': 1},
            
            # Domestic Violence
            {'name': 'Domestic Violence Helpline', 'number': '181', 'category': 'domestic', 'priority': 1},
            {'name': 'National Domestic Violence', 'number': '1800-102-7299', 'category': 'domestic', 'priority': 2},
            
            # Women Helpline
            {'name': 'Women Helpline', 'number': '1091', 'category': 'women', 'priority': 1},
            {'name': 'Vanitha Helpline', 'number': '1517', 'category': 'women', 'priority': 2},
            
            # General
            {'name': 'Police Control Room', 'number': '100', 'category': 'general', 'priority': 1},
            {'name': 'Ambulance', 'number': '102', 'category': 'general', 'priority': 1},
        ]
        
        count = 0
        for data in helplines:
            obj, created = CrisisHelpline.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            if created:
                count += 1
                self.stdout.write(f"✓ Added: {data['name']} - {data['number']}")
        
        self.stdout.write(self.style.SUCCESS(f"\n✅ Successfully added {count} crisis helplines!"))