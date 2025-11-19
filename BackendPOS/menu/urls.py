from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "menu"

router = DefaultRouter()
router.register(r"menu-items", views.MenuItemViewSet, basename="menuitem")
router.register(r"categories", views.CategoryViewSet, basename="category")

urlpatterns = [
    path(
        "data",
        views.MenuDataView.as_view(),
        name="all-data",
    ),
]

urlpatterns += router.urls
