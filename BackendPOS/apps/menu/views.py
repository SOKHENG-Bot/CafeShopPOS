from rest_framework import permissions, viewsets
from .models import Item, Category
from .serializers import MenuItemSerializer, CategorySerializer
import logging

logger = logging.getLogger(__name__)


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

    def create(self, request, *args, **kwargs):
        logger.info(f"Creating menu item. Image in request: {'image' in request.FILES}")
        if 'image' in request.FILES:
            logger.info(f"Image file: {request.FILES['image'].name}, size: {request.FILES['image'].size}")

        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:
            item_data = response.data
            logger.info(f"Created item with image_url: {item_data.get('image_url')}")
            logger.info(f"Raw image field: {item_data.get('image')}")
            logger.info(f"Full response data: {item_data}")

        return response
