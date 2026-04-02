from django.urls import path

from .views import CartItemAddView, CartItemUpdateDeleteView, CartView

urlpatterns = [
    path("", CartView.as_view(), name="cart"),
    path("items/", CartItemAddView.as_view(), name="cart-item-add"),
    path("items/<int:item_id>/", CartItemUpdateDeleteView.as_view(), name="cart-item-update-delete"),
]
