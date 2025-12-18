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

    # Full image URL
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if obj.image:
            # For Cloudinary URLs, return the URL directly (already absolute)
            # For local files, build absolute URI
            if hasattr(obj.image, 'url') and obj.image.url.startswith('http'):
                return obj.image.url
            else:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.image.url)
                return obj.image.url
        return None

    class Meta:
        model = Item
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "image",
            "image_url",
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
