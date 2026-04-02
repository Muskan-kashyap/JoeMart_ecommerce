from django.urls import path

from .views import AdminOrderListView, AdminOrderStatusUpdateView, CheckoutView, OrderCancelView, OrderDetailView, OrderListView

urlpatterns = [
    path("", OrderListView.as_view(), name="orders"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("<int:order_id>/", OrderDetailView.as_view(), name="order-detail"),
    path("<int:order_id>/cancel/", OrderCancelView.as_view(), name="order-cancel"),
    path("admin/", AdminOrderListView.as_view(), name="admin-orders"),
    path("admin/<int:order_id>/status/", AdminOrderStatusUpdateView.as_view(), name="admin-order-status"),
]
