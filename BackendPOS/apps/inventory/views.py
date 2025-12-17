from django.db import models
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import InventoryAdjustment, InventoryItem
from .serializers import InventoryAdjustmentSerializer, InventoryItemSerializer


class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.select_related("menu_item").all()
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"])
    def low_stock(self, request):
        # Get all items with stock below minimum quantity
        low_stock_items = self.queryset.filter(
            quantity__lt=models.F("minimum_quantity")
        )
        serializer = self.get_serializer(low_stock_items, many=True)
        return Response(serializer.data)


class InventoryAdjustmentViewSet(viewsets.ModelViewSet):
    queryset = InventoryAdjustment.objects.select_related(
        "inventory_item__menu_item", "created_by"
    ).all()
    serializer_class = InventoryAdjustmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Optionally filter by inventory item
        queryset = super().get_queryset()
        inventory_item_id = self.request.query_params.get("inventory_item", None)
        if inventory_item_id:
            queryset = queryset.filter(inventory_item_id=inventory_item_id)
        return queryset
