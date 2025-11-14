from django.db import models
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Inventory, InventoryAdjustment
from .serializers import (
    InventoryAdjustmentCreateSerializer,
    InventoryAdjustmentSerializer,
    InventorySerializer,
)


class InventoryListCreateView(generics.ListCreateAPIView):
    """API view to list all inventory items and create new ones"""

    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]


class InventoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API view to retrieve, update, and delete an inventory item"""

    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]


class InventoryAdjustmentListCreateView(generics.ListCreateAPIView):
    """API view to list all inventory adjustments and create new ones"""

    queryset = InventoryAdjustment.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self): # type: ignore
        if self.request.method == "POST":
            return InventoryAdjustmentCreateSerializer
        return InventoryAdjustmentSerializer


class InventoryAdjustmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API view to retrieve, update, and delete an inventory adjustment"""

    queryset = InventoryAdjustment.objects.all()
    serializer_class = InventoryAdjustmentSerializer
    permission_classes = [IsAuthenticated]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_low_stock_items(request):
    """Get all items that are low on stock"""
    low_stock_items = Inventory.objects.filter(
        current_stock__lte=models.F("minimum_stock")
    )

    serializer = InventorySerializer(low_stock_items, many=True)
    return Response(serializer.data)
