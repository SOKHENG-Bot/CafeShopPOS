from decimal import Decimal

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Inventory(models.Model):
    UNIT_CHOICES = [
        ("kg", "Kilograms"),
        ("g", "Grams"),
        ("l", "Liters"),
        ("ml", "Milliliters"),
        ("pieces", "Pieces"),
        ("boxes", "Boxes"),
        ("cans", "Cans"),
        ("bottles", "Bottles"),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default="pieces")
    current_stock = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0")
    )
    minimum_stock = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0")
    )
    unit_cost = models.DecimalField(
        max_digits=8, decimal_places=2, default=Decimal("0")
    )
    supplier = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.current_stock} {self.unit})"

    @property
    def is_low_stock(self):
        return self.current_stock <= self.minimum_stock

    @property
    def total_value(self):
        return self.current_stock * self.unit_cost


class InventoryAdjustment(models.Model):
    ADJUSTMENT_TYPE_CHOICES = [
        ("stock_in", "Stock In"),
        ("stock_out", "Stock Out"),
        ("adjustment", "Adjustment"),
        ("waste", "Waste"),
        ("return", "Return"),
    ]

    inventory = models.ForeignKey(
        Inventory, on_delete=models.CASCADE, related_name="adjustments"
    )
    adjustment_type = models.CharField(max_length=20, choices=ADJUSTMENT_TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.TextField(blank=True, null=True)
    staff = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="inventory_adjustments"
    )
    adjustment_date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-adjustment_date"]

    def __str__(self):
        return f"{self.adjustment_type} - {self.inventory.name} ({self.quantity})"

    def save(self, *args, **kwargs):
        # Update inventory stock based on adjustment type
        if self.adjustment_type == "stock_in":
            self.inventory.current_stock += self.quantity
        elif self.adjustment_type in ["stock_out", "waste"]:
            self.inventory.current_stock -= self.quantity
        elif self.adjustment_type == "adjustment":
            # For adjustments, quantity can be positive or negative
            self.inventory.current_stock += self.quantity
        elif self.adjustment_type == "return":
            self.inventory.current_stock += self.quantity

        self.inventory.save()
        super().save(*args, **kwargs)
