from django.core.management.base import BaseCommand
from safety.models import Helpline

class Command(BaseCommand):
    help = 'Seed helpline numbers into the database'

    def handle(self, *args, **kwargs):
        helplines = [
            # Police & Emergency
            {'name': 'Police Control Room', 'number': '100', 'category': 'police', 'priority': 1, 'is_24x7': True},
            {'name': 'Women Helpline', 'number': '1091', 'category': 'women', 'priority': 1, 'is_24x7': True},
            {'name': 'Ambulance', 'number': '102', 'category': 'ambulance', 'priority': 1, 'is_24x7': True},
            {'name': 'Child Helpline', 'number': '1098', 'category': 'child', 'priority': 1, 'is_24x7': True},
            
            # Mental Health
            {'name': 'Mental Health Helpline', 'number': '104', 'category': 'mental', 'priority': 2, 'is_24x7': True},
            {'name': 'iCall', 'number': '9152987821', 'category': 'mental', 'priority': 2, 'is_24x7': True, 
             'description': 'Mental health support helpline'},
            
            # Kerala specific
            {'name': 'Kerala Women Helpline', 'number': '1091', 'category': 'women', 'priority': 1, 'is_24x7': True},
            {'name': 'Vanitha Helpline', 'number': '1517', 'category': 'women', 'priority': 2, 'is_24x7': True,
             'description': 'Kerala Police Women Helpline'},
            
            # General
            {'name': 'Disaster Management', 'number': '1077', 'category': 'disaster', 'priority': 2, 'is_24x7': True},
            {'name': 'Fire Station', 'number': '101', 'category': 'fire', 'priority': 2, 'is_24x7': True},
            {'name': 'Legal Aid Helpline', 'number': '1516', 'category': 'legal', 'priority': 3, 'is_24x7': False,
             'description': 'Legal assistance helpline - 10 AM to 6 PM'},
            {'name': 'National Commission for Women', 'number': '7827170170', 'category': 'women', 'priority': 2, 'is_24x7': False},
            {'name': 'Cyber Crime Helpline', 'number': '1930', 'category': 'general', 'priority': 2, 'is_24x7': True},
        ]
        
        count = 0
        for data in helplines:
            obj, created = Helpline.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            if created:
                count += 1
                self.stdout.write(f"✓ Added: {data['name']} - {data['number']}")
        
        self.stdout.write(
            self.style.SUCCESS(f"\n✅ Successfully added {count} helpline numbers!")
        )