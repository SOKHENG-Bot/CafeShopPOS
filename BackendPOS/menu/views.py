from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from menu.models import Category, MenuItem
from menu.serializers import CategorySerializer, MenuItemSerializer


class CategoryViewSet(viewsets.ModelViewSet):  # CRUD operations of Category
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class MenuItemViewSet(viewsets.ModelViewSet):  # CRUD operations of MenuItem
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]


class MenuDataView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable authentication for this view

    def get(self, request):  # Show all data to the frontend
        categories = Category.objects.filter(is_active=True)
        categories_serializer = CategorySerializer(categories, many=True)

        menu_items = MenuItem.objects.all()
        menu_items_serializer = MenuItemSerializer(menu_items, many=True)

        return Response(
            {
                "items": menu_items_serializer.data,
                "categories": categories_serializer.data,
            }
        )
