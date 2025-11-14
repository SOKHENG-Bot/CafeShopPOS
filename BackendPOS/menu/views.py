from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from menu.models import Category, MenuItem
from menu.serializers import CategorySerializer, MenuItemSerializer


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]


class AvailableMenuItemView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        menu_items = MenuItem.objects.filter(stock__gt=0)
        serializer = MenuItemSerializer(menu_items, many=True)
        return Response(serializer.data)


class MenuDataView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable authentication for this view

    def get(self, request):
        # Get all active categories
        categories = Category.objects.filter(is_active=True)
        categories_serializer = CategorySerializer(categories, many=True)

        # Get all menu items (including those with zero stock for admin purposes)
        menu_items = MenuItem.objects.all()
        menu_items_serializer = MenuItemSerializer(menu_items, many=True)

        return Response(
            {
                "items": menu_items_serializer.data,
                "categories": categories_serializer.data,
            }
        )
