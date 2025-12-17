from django.contrib import admin
from .models import Item, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "order", "created_at", "updated_at"]
    search_fields = ["name"]


@admin.register(Item)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "stock", "created_at", "updated_at")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
