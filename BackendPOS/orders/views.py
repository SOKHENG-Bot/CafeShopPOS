from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Order, Payment, Table
from .serializers import (
    OrderCreateSerializer,
    OrderSerializer,
    PaymentSerializer,
    TableSerializer,
)


class TableListCreateView(generics.ListCreateAPIView):
    """API view to list all tables and create new ones"""

    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [IsAuthenticated]


class TableDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API view to retrieve, update, and delete a table"""

    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [IsAuthenticated]


class OrderListCreateView(generics.ListCreateAPIView):
    """API view to list all orders and create new ones"""

    queryset = Order.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self): # type: ignore
        if self.request.method == "POST":
            return OrderCreateSerializer
        return OrderSerializer


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API view to retrieve, update, and delete an order"""

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


class PaymentListCreateView(generics.ListCreateAPIView):
    """API view to list all payments and create new ones"""

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]


class PaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API view to retrieve, update, and delete a payment"""

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_order_status(request, pk):
    """Update order status"""
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get("status")
    if new_status not in dict(Order.STATUS_CHOICES):
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    order.status = new_status
    order.save()

    serializer = OrderSerializer(order)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_orders_by_status(request, status_filter):
    """Get orders filtered by status"""
    if status_filter not in dict(Order.STATUS_CHOICES):
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    orders = Order.objects.filter(status=status_filter)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_orders_by_table(request, table_id):
    """Get orders for a specific table"""
    try:
        table = Table.objects.get(pk=table_id)
    except Table.DoesNotExist:
        return Response({"error": "Table not found"}, status=status.HTTP_404_NOT_FOUND)

    orders = Order.objects.filter(table=table)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
