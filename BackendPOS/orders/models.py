from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

# Create your models here.


class Table(models.Model):
    """Model for tables in the cafe POS system"""

    STATUS_CHOICES = [
        ("available", "Available"),
        ("occupied", "Occupied"),
        ("reserved", "Reserved"),
        ("maintenance", "Maintenance"),
    ]

    number = models.IntegerField(unique=True)
    capacity = models.IntegerField(default=4)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="available"
    )
    current_order = models.OneToOneField(
        "Order",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="table_order",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["number"]

    def __str__(self):
        return f"Table {self.number}"


class Order(models.Model):
    """Model for orders in the cafe POS system"""

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("preparing", "Preparing"),
        ("ready", "Ready"),
        ("served", "Served"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    ]

    ORDER_TYPE_CHOICES = [
        ("dine_in", "Dine In"),
        ("takeout", "Takeout"),
        ("delivery", "Delivery"),
    ]

    order_number = models.CharField(max_length=20, unique=True, blank=True)
    table = models.ForeignKey(
        Table, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    order_type = models.CharField(
        max_length=20, choices=ORDER_TYPE_CHOICES, default="dine_in"
    )
    customer_name = models.CharField(max_length=100, blank=True, null=True)
    staff = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="orders"
    )
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order {self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate order number: YYYYMMDD + sequential number
            today = self.created_at.date() if self.created_at else timezone.now().date()
            date_str = today.strftime("%Y%m%d")
            # Get the last order number for today
            last_order = (
                Order.objects.filter(order_number__startswith=date_str)
                .order_by("-order_number")
                .first()
            )

            if last_order:
                # Extract the sequential number and increment
                seq_num = int(last_order.order_number[-4:]) + 1
            else:
                seq_num = 1

            self.order_number = f"{date_str}{seq_num:04d}"
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """Model for items within an order"""

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey("menu.MenuItem", on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)
    special_instructions = models.TextField(blank=True, null=True)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"

    def save(self, *args, **kwargs):
        self.subtotal = self.quantity * self.unit_price
        super().save(*args, **kwargs)


class Payment(models.Model):
    """Model for payments in the cafe POS system"""

    PAYMENT_METHOD_CHOICES = [
        ("cash", "Cash"),
        ("card", "Card"),
        ("digital", "Digital Wallet"),
        ("split", "Split Payment"),
    ]

    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, related_name="payment"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    staff = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="payments"
    )

    def __str__(self):
        return f"Payment for Order {self.order.order_number}"
