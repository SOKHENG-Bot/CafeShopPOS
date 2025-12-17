from django.conf import settings
from django.db import models


class InventoryItem(models.Model):
    menu_item = models.OneToOneField(
        "menu.Item", on_delete=models.CASCADE, related_name="inventory"
    )
    quantity = models.IntegerField(default=0)
    minimum_quantity = models.IntegerField(default=5)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.menu_item.name} - {self.quantity}"

    @property
    def is_low_stock(self):
        return self.quantity < self.minimum_quantity


class InventoryAdjustment(models.Model):
    inventory_item = models.ForeignKey(
        InventoryItem, on_delete=models.CASCADE, related_name="adjustments"
    )
    change = models.IntegerField()  # positive for add and negative for remove
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.inventory_item.menu_item.name} ({self.change})"

    def save(self, *args, **kwargs):
        is_new = self.pk is None  # Check if this is a new record

        if is_new:
            # Update inventory quantity atomically using F() expression
            self.inventory_item.quantity = models.F("quantity") + self.change
            self.inventory_item.save(update_fields=["quantity"])
            # Refresh to get actual value (F() expressions are evaluated in DB)
            self.inventory_item.refresh_from_db()

        super().save(*args, **kwargs)
