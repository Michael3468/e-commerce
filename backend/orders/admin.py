"""Admin configuration for orders app."""
from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['title', 'price', 'quantity', 'product']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'status', 'total', 'customer_name', 'customer_phone', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['id', 'customer_name', 'customer_email', 'customer_phone']
    readonly_fields = ['id', 'total', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
