from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from catalog.models import Category, Product, ProductImage
from orders.models import Order, OrderItem


class Command(BaseCommand):
    help = "Seed demo categories, products, and images."

    def add_arguments(self, parser):
        parser.add_argument("--with-admin", action="store_true", help="Create a demo admin user if missing")
        parser.add_argument("--reset", action="store_true", help="Delete existing products and categories before seeding")

    def handle(self, *args, **options):
        if options.get("reset"):
            OrderItem.objects.all().delete()
            Order.objects.all().delete()
            ProductImage.objects.all().delete()
            Product.objects.all().delete()
            Category.objects.all().delete()

        categories = {
            "Essentials": [
                ("Aether Linen Shirt", "Breathable linen shirt for everyday comfort.", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200"),
                ("Sage Cotton Tee", "Soft cotton tee with a relaxed fit.", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200"),
            ],
            "Workspace": [
                ("Minimal Desk Lamp", "Warm task lighting for focus sessions.", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200"),
                ("Stoneware Mug", "Hand-crafted mug for quiet mornings.", "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1200"),
            ],
            "Travel": [
                ("Weekender Bag", "Structured bag with spacious interior.", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200"),
                ("Trail Water Bottle", "Vacuum-insulated for long days.", "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1200"),
            ],
        }

        created_products = 0
        for category_name, items in categories.items():
            category, _ = Category.objects.get_or_create(name=category_name)
            for name, description, image_url in items:
                product, created = Product.objects.get_or_create(
                    category=category,
                    name=name,
                    defaults={
                        "description": description,
                        "price": 1299,
                        "stock": 25,
                        "is_active": True,
                    },
                )
                if created:
                    created_products += 1
                    ProductImage.objects.create(
                        product=product,
                        image_url=image_url,
                        alt_text=name,
                        is_primary=True,
                    )

        if options.get("with_admin"):
            admin, created = User.objects.get_or_create(username="admin", defaults={"email": "admin@example.com"})
            if created:
                admin.is_staff = True
                admin.is_superuser = True
                admin.set_password("Admin@12345")
                admin.save()
                self.stdout.write(self.style.SUCCESS("Demo admin created: admin / Admin@12345"))

        self.stdout.write(self.style.SUCCESS(f"Seed complete. Added {created_products} products."))
