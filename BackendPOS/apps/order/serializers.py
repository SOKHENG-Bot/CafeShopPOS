from rest_framework import serializers
from .models import OrderItem, Order
from django.db import transaction
from core.exceptions import InsufficientStockException
from apps.menu.models import Item


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    # menu_item = serializers.StringRelatedField()

    class Meta:
        model = OrderItem
        fields = ("menu_item", "quantity", "price")

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["menu_item"] = instance.menu_item.name
        return rep


class OrderSerializer(serializers.ModelSerializer):  # Nested serializers
    created_by = serializers.StringRelatedField(read_only=True)
    items = OrderItemSerializer(many=True, read_only=False, required=False)

    class Meta:
        model = Order
        fields = (
            "id",
            "order_number",
            "created_by",
            "created_at",
            "status",
            "total",
            "items",
        )
        read_only_fields = ("order_number", "total")

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = self.context["request"].user if self.context["request"].user.is_authenticated else None

        with transaction.atomic():
            order = Order.objects.create(created_by=user)
            total = 0

            for item in items_data:
                menu_item = item["menu_item"]
                quantity = item["quantity"]

                if menu_item.inventory.quantity < quantity:
                    raise InsufficientStockException(
                        f"Not enough stock for {menu_item.name}",
                        item=menu_item.name,
                        requested=quantity,
                    )

                price = menu_item.price
                OrderItem.objects.create(
                    order=order,
                    menu_item=menu_item,
                    quantity=quantity,
                    price=price,
                )
                total += price * quantity

            order.total = total
            order.save()
            return order

    def update(self, instance, validated_data):
        # Handle status changes and trigger inventory updates
        old_status = instance.status
        new_status = validated_data.get("status", old_status)

        # Update the order fields (excluding items since they shouldn't be updated)
        validated_data.pop("items", None)  # Remove items if present

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Trigger inventory updates based on status change
        if old_status != new_status:
            if new_status == "preparing":
                instance.complete_order()
            elif new_status == "cancelled":
                instance.cancel_order()
            else:
                instance.save()
        else:
            instance.save()

        return instance
