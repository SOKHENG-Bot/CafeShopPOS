from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "menu"

router = DefaultRouter()
router.register(r"menu-items", views.MenuItemViewSet)


urlpatterns = [
    path(
        "menu-items/",
        views.MenuDataView.as_view(),
        name="menu-data",
    ),
    path(
        "menu-items/available/",
        views.AvailableMenuItemView.as_view(),
        name="available-menu-items",
    ),
    path(
        "categories/",
        views.CategoryListCreateView.as_view(),
        name="category-list-create",
    ),
    path(
        "categories/<int:pk>/",
        views.CategoryDetailView.as_view(),
        name="category-detail",
    ),
]

urlpatterns += router.urls
