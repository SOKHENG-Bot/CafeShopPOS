from core.utils import get_upload_path
from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from cloudinary_storage.storage import MediaCloudinaryStorage


def menu_image_upload_path(instance, filename):
    return get_upload_path(instance, filename, "menu_image/")


class Category(models.Model):
    name = models.CharField(max_length=20, unique=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Auto-increment order if not set
        if self.order == 0 and not self.pk:  # New category with default order
            # Get the highest order value and add 1
            max_order = Category.objects.aggregate(models.Max("order"))["order__max"]
            self.order = (max_order or 0) + 1
        super().save(*args, **kwargs)

    @property
    def item_count(self):
        return self.items.count()


class Item(models.Model):
    name = models.CharField(max_length=20)
    slug = models.SlugField(max_length=20, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, max_length=30)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    image = models.ImageField(upload_to=menu_image_upload_path, storage=MediaCloudinaryStorage(), null=True, blank=True)
    category = models.ForeignKey("Category", on_delete=models.CASCADE, null=True, blank=True, related_name="items")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "items"

    def __str__(self):
        return self.name

    def clean(self):
        # Validate models data
        super().clean()
        if self.price and self.price <= 0:
            raise ValidationError({"Price": "Price must be greater than 0"})
        if self.name and len(self.name.strip()) == 0:
            raise ValidationError({"name": "Name cannot be empty"})

    @property
    # Property to get current stock from InventoryItem
    def stock(self):
        try:
            return self.inventory.quantity
        except AttributeError:
            return 0

    @property
    def lowStockThreshold(self):
        try:
            return self.inventory.is_low_stock
        except AttributeError:
            return 0
