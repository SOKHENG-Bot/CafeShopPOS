from django.urls import path

from . import views

urlpatterns = [
    # Tables
    path("tables/", views.TableListCreateView.as_view(), name="table-list-create"),
    path("tables/<int:pk>/", views.TableDetailView.as_view(), name="table-detail"),
    # Orders
    path("", views.OrderListCreateView.as_view(), name="order-list-create"),
    path("<int:pk>/", views.OrderDetailView.as_view(), name="order-detail"),
    path("<int:pk>/status/", views.update_order_status, name="update-order-status"),
    path(
        "status/<str:status_filter>/",
        views.get_orders_by_status,
        name="orders-by-status",
    ),
    path("table/<int:table_id>/", views.get_orders_by_table, name="orders-by-table"),
    # Payments
    path(
        "payments/", views.PaymentListCreateView.as_view(), name="payment-list-create"
    ),
    path(
        "payments/<int:pk>/", views.PaymentDetailView.as_view(), name="payment-detail"
    ),
]
