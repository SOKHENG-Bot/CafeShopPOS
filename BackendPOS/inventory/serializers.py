from rest_framework import serializers

from .models import Inventory, InventoryAdjustment


class InventorySerializer(serializers.ModelSerializer):
    is_low_stock = serializers.BooleanField(read_only=True)
    total_value = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Inventory
        fields = [
            "id",
            "name",
            "description",
            "unit",
            "current_stock",
            "minimum_stock",
            "unit_cost",
            "supplier",
            "location",
            "expiry_date",
            "is_active",
            "is_low_stock",
            "total_value",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class InventoryAdjustmentSerializer(serializers.ModelSerializer):
    inventory_name = serializers.CharField(source="inventory.name", read_only=True)
    staff_name = serializers.CharField(source="staff.username", read_only=True)

    class Meta:
        model = InventoryAdjustment
        fields = [
            "id",
            "inventory",
            "inventory_name",
            "adjustment_type",
            "quantity",
            "reason",
            "staff",
            "staff_name",
            "adjustment_date",
            "created_at",
        ]
        read_only_fields = ["id", "adjustment_date", "created_at"]


class InventoryAdjustmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating inventory adjustments"""

    class Meta:
        model = InventoryAdjustment
        fields = [
            "inventory",
            "adjustment_type",
            "quantity",
            "reason",
        ]

    def create(self, validated_data):
        # Create adjustment record - the model's save method will handle stock updates
        adjustment = InventoryAdjustment.objects.create(
            inventory=validated_data["inventory"],
            adjustment_type=validated_data["adjustment_type"],
            quantity=validated_data["quantity"],
            reason=validated_data.get("reason", ""),
            staff=self.context["request"].user if self.context.get("request") else None,
        )
        return adjustment
