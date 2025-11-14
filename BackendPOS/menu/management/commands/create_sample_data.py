from django.core.management.base import BaseCommand
from menu.models import Category, MenuItem


class Command(BaseCommand):
    help = "Create sample menu data"

    def handle(self, *args, **options):
        # Clear existing data
        MenuItem.objects.all().delete()
        Category.objects.all().delete()

        # Create categories
        appetizers = Category.objects.create(
            name="Appetizers", description="Start your meal right", order=1
        )
        mains = Category.objects.create(
            name="Main Courses", description="Hearty main dishes", order=2
        )
        desserts = Category.objects.create(
            name="Desserts", description="Sweet endings", order=3
        )
        beverages = Category.objects.create(
            name="Beverages", description="Refreshing drinks", order=4
        )

        # Create menu items
        MenuItem.objects.create(
            name="Caesar Salad",
            description="Fresh romaine lettuce with caesar dressing",
            price=12.99,
            stock=10,
            category=appetizers,
        )
        MenuItem.objects.create(
            name="Chicken Wings",
            description="Crispy wings with buffalo sauce",
            price=14.99,
            stock=15,
            category=appetizers,
        )
        MenuItem.objects.create(
            name="Grilled Salmon",
            description="Fresh Atlantic salmon with vegetables",
            price=24.99,
            stock=8,
            category=mains,
        )
        MenuItem.objects.create(
            name="Ribeye Steak",
            description="Prime ribeye with garlic butter",
            price=32.99,
            stock=5,
            category=mains,
        )
        MenuItem.objects.create(
            name="Chocolate Cake",
            description="Rich chocolate cake with vanilla frosting",
            price=8.99,
            stock=12,
            category=desserts,
        )
        MenuItem.objects.create(
            name="Ice Cream Sundae",
            description="Vanilla ice cream with chocolate sauce",
            price=6.99,
            stock=20,
            category=desserts,
        )
        MenuItem.objects.create(
            name="Coffee",
            description="Freshly brewed coffee",
            price=3.99,
            stock=50,
            category=beverages,
        )
        MenuItem.objects.create(
            name="Soda",
            description="Your choice of soft drink",
            price=2.99,
            stock=100,
            category=beverages,
        )

        self.stdout.write(self.style.SUCCESS("Successfully created sample menu data"))
