from django.db import models
from django.conf import settings
from core.utils import generate_order_number
from django.db import transaction
from decimal import Decimal


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("preparing", "Preparing"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    order_number = models.CharField(max_length=30, unique=True, default=generate_order_number)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["-created_at"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return self.order_number

    @transaction.atomic
    def calculate_total(self):
        # Calculate total with transaction safety
        total = Decimal("0.00")
        for item in self.items.all():
            total += item.quantity * item.price
        self.total = total
        self.save()
        return total

    @transaction.atomic
    def complete_order(self):
        # Update inventory when order is completed
        for item in self.items.all():
            inventory = item.menu_item.inventory
            if inventory:
                inventory.quantity -= item.quantity
                inventory.save()
                item.menu_item.refresh_from_db()

        self.status = "preparing"
        self.save()

    @transaction.atomic
    def cancel_order(self):
        # Update inventory when order is cancel
        for item in self.items.all():
            inventory = item.menu_item.inventory
            if inventory:
                inventory.quantity += item.quantity
                inventory.save()
                item.menu_item.refresh_from_db()

        self.status = "cancelled"
        self.save()


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )
    menu_item = models.ForeignKey("menu.Item", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.menu_item.name} x{self.quantity}"
