from rest_framework import serializers
from .models import InventoryAdjustment, InventoryItem
from apps.menu.models import Item


class InventoryItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="menu_item.category.name", read_only=True)
    category_id = serializers.IntegerField(source="menu_item.category.id", read_only=True)
    menu_item_name = serializers.CharField(source="menu_item.name", read_only=True)
    menu_item_id = serializers.IntegerField(source="menu_item.id", read_only=True)
    menu_item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.select_related("category"), write_only=True)
    is_low_stock = serializers.SerializerMethodField()

    class Meta:
        model = InventoryItem
        fields = (
            "id",
            "menu_item",
            "menu_item_name",
            "menu_item_id",
            "quantity",
            "updated_at",
            "minimum_quantity",
            "is_low_stock",
            "category_name",
            "category_id",
        )

    def get_is_low_stock(self, obj):
        return obj.is_low_stock


class InventoryAdjustmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryAdjustment
        fields = ("id", "inventory_item", "change", "created_by", "created_at")
        read_only_fields = ("created_by", "created_at")

    def create(self, validated_data):
        # Create adjustment and auto-set created_by from request
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["created_by"] = request.user

        # Model's save() method will handle inventory update
        return super().create(validated_data)
