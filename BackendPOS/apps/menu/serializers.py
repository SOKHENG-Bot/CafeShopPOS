from rest_framework import serializers
from .models import Category, Item


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for menu categories"""

    class Meta:
        model = Category
        fields = ("id", "name", "order", "item_count", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class MenuItemSerializer(serializers.ModelSerializer):
    # Category field for write operations (accepts category ID)
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True,
    )

    # Category details for read operations (displays full category info)
    category_detail = CategorySerializer(source="category", read_only=True)

    class Meta:
        model = Item
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "image",
            "category",
            "category_detail",
            "stock",
            "created_at",
            "updated_at",
            "lowStockThreshold",
        ]
        read_only_fields = ("id", "stock", "created_at", "updated_at")

    def validate_price(self, value):
        # Validate price must be positive
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value

    def validate_name(self, value):
        # Validate name must not be empty
        if not value or not value.strip():
            raise serializers.ValidationError("Name cannot be empty")
        return value.strip()
