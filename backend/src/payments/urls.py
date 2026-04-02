from django.urls import path

from .views import PaymentConfirmView, PaymentIntentView, StripeWebhookView

urlpatterns = [
    path("intent/", PaymentIntentView.as_view(), name="payment-intent"),
    path("confirm/", PaymentConfirmView.as_view(), name="payment-confirm"),
    path("webhook/", StripeWebhookView.as_view(), name="stripe-webhook"),
]
