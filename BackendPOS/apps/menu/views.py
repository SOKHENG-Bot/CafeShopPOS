from rest_framework import permissions, viewsets
from .models import Item, Category
from .serializers import MenuItemSerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    search_fields = ["name", "order"]
    ordering_fields = ["created_at"]


class ItemsViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    search_fields = ["name", "description"]
    ordering_fields = ["price", "created_at"]
