from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(
    r"items",
    views.InventoryItemViewSet,
    basename="inventory-items",
)
router.register(
    r"adjustments",
    views.InventoryAdjustmentViewSet,
    basename="inventory-adjustments",
)

urlpatterns = router.urls
