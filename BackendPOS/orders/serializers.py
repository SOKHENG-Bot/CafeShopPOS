from decimal import Decimal

from rest_framework import serializers

from .models import Order, OrderItem, Payment, Table


class TableSerializer(serializers.ModelSerializer):
    """Serializer for Table model"""

    class Meta:
        model = Table
        fields = [
            "id",
            "number",
            "capacity",
            "status",
            "current_order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model"""

    menu_item_name = serializers.CharField(source="menu_item.name", read_only=True)
    menu_item_price = serializers.DecimalField(
        source="menu_item.price", max_digits=8, decimal_places=2, read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "menu_item",
            "menu_item_name",
            "menu_item_price",
            "quantity",
            "unit_price",
            "special_instructions",
            "subtotal",
        ]
        read_only_fields = ["id", "subtotal"]


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""

    items = OrderItemSerializer(many=True, read_only=True)
    table_number = serializers.IntegerField(source="table.number", read_only=True)
    staff_name = serializers.CharField(source="staff.username", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "table",
            "table_number",
            "status",
            "order_type",
            "customer_name",
            "staff",
            "staff_name",
            "subtotal",
            "tax",
            "total",
            "notes",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "order_number",
            "staff",
            "staff_name",
            "subtotal",
            "tax",
            "total",
            "created_at",
            "updated_at",
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders"""

    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "table",
            "status",
            "order_type",
            "customer_name",
            "notes",
            "items",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)

        # Calculate totals
        subtotal = Decimal("0")
        for item_data in items_data:
            menu_item = item_data["menu_item"]
            quantity = item_data["quantity"]
            unit_price = menu_item.price  # Use current menu price
            subtotal += unit_price * quantity

            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=quantity,
                unit_price=unit_price,
                special_instructions=item_data.get("special_instructions", ""),
            )

        # Calculate tax (assuming 10% tax rate)
        tax = subtotal * Decimal("0.10")
        total = subtotal + tax

        order.subtotal = subtotal
        order.tax = tax
        order.total = total
        order.save()

        return order


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""

    order_number = serializers.CharField(source="order.order_number", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "order_number",
            "amount",
            "payment_method",
            "payment_date",
            "notes",
            "staff",
        ]
        read_only_fields = ["id", "payment_date"]
