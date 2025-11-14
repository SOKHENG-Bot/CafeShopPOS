from django.urls import path

from . import views

urlpatterns = [
    path("", views.InventoryListCreateView.as_view(), name="inventory-list-create"),
    path("<int:pk>/", views.InventoryDetailView.as_view(), name="inventory-detail"),
    path(
        "adjustments/",
        views.InventoryAdjustmentListCreateView.as_view(),
        name="inventory-adjustment-list-create",
    ),
    path(
        "adjustments/<int:pk>/",
        views.InventoryAdjustmentDetailView.as_view(),
        name="inventory-adjustment-detail",
    ),
    path("low-stock/", views.get_low_stock_items, name="low-stock-items"),
]
