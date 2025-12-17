from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ("menu_item", "quantity", "price")
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_number",
        "created_by",
        "status",
        "total",
        "created_at",
    )
    search_fields = ("order_number", "created_by__username")
    list_filter = ("status",)
    inlines = [OrderItemInline]
