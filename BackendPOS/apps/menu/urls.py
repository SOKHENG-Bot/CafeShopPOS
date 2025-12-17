from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"items", views.ItemsViewSet, basename="items")
router.register(r"categories", views.CategoryViewSet, basename="categories")

urlpatterns = router.urls
