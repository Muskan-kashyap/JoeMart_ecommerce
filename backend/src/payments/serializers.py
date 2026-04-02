from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "order", "provider", "provider_payment_id", "amount", "status", "created_at"]
        read_only_fields = ["id", "provider_payment_id", "status", "created_at"]
