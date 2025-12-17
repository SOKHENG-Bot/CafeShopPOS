from django.contrib import admin
from .models import InventoryAdjustment, InventoryItem


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "menu_item",
        "quantity",
        "minimum_quantity",
        "is_low_stock",
        "updated_at",
    ]
    search_fields = ["menu_item__name"]
    list_filter = ["updated_at"]
    readonly_fields = ["updated_at"]
    ordering = ["-updated_at"]


@admin.register(InventoryAdjustment)
class InventoryAdjustmentAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "get_menu_item",
        "inventory_item",
        "change",
        "get_change_type",
        "created_by",
        "created_at",
    ]
    search_fields = ["inventory_item__menu_item__name"]
    list_filter = ["created_at", "created_by"]
    readonly_fields = ["created_by", "created_at"]
    ordering = ["-created_at"]

    def get_menu_item(self, obj):
        # Display the menu item name
        return obj.inventory_item.menu_item.name

    def get_change_type(self, obj):
        # Display whether it's an addition or removal
        if obj.change > 0:
            return f"Added {obj.change}"
        else:
            return f"Removed {abs(obj.change)}"

    def save_model(self, request, obj, form, change):
        # Auto-set created_by to current user
        if not change:  # Only on creation
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
