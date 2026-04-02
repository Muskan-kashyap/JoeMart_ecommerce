import stripe
from datetime import datetime
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order

from .models import Payment
from .serializers import PaymentSerializer


class PaymentIntentView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		order_id = request.data.get("order_id")
		order = Order.objects.filter(id=order_id, user=request.user).first()
		if not order:
			return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

		payment, _ = Payment.objects.get_or_create(
			order=order,
			user=request.user,
			defaults={"amount": order.total_amount},
		)

		if not settings.STRIPE_SECRET_KEY:
			return Response(
				{
					"client_secret": f"dev_secret_{order.id}",
					"payment": PaymentSerializer(payment).data,
					"note": "Stripe key not configured. Running in dev mode.",
				}
			)

		stripe.api_key = settings.STRIPE_SECRET_KEY
		intent = stripe.PaymentIntent.create(
			amount=int(order.total_amount * 100),
			currency="inr",
			metadata={"order_id": str(order.id), "user_id": str(request.user.id)},
		)

		payment.provider_payment_id = intent.id
		payment.save(update_fields=["provider_payment_id"])

		return Response({"client_secret": intent.client_secret, "payment": PaymentSerializer(payment).data})


class PaymentConfirmView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		order_id = request.data.get("order_id")
		order = Order.objects.filter(id=order_id, user=request.user).first()
		if not order or not hasattr(order, "payment"):
			return Response({"detail": "Payment not found."}, status=status.HTTP_404_NOT_FOUND)

		order.payment.status = "succeeded"
		order.payment.save(update_fields=["status"])
		order.status = "paid"
		order.save(update_fields=["status"])

		return Response({"detail": "Payment confirmed.", "payment": PaymentSerializer(order.payment).data})


class StripeWebhookView(APIView):
	permission_classes = [permissions.AllowAny]

	def post(self, request):
		payload = request.body
		sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")

		if settings.STRIPE_WEBHOOK_SECRET:
			try:
				event = stripe.Webhook.construct_event(
					payload=payload,
					sig_header=sig_header,
					secret=settings.STRIPE_WEBHOOK_SECRET,
				)
			except (ValueError, stripe.error.SignatureVerificationError):
				return Response({"detail": "Invalid webhook signature."}, status=status.HTTP_400_BAD_REQUEST)
		else:
			# Dev mode: accept payload without verification
			try:
				event = stripe.Event.construct_from(request.data, stripe.api_key)
			except Exception:
				event = {"type": "unparsed.event", "data": {"object": {}}}

		event_type = event.get("type", "")
		data_object = event.get("data", {}).get("object", {})
		payment_intent_id = data_object.get("id", "")
		order_id = None

		metadata = data_object.get("metadata", {})
		if isinstance(metadata, dict):
			order_id = metadata.get("order_id")

		payment = None
		if payment_intent_id:
			payment = Payment.objects.filter(provider_payment_id=payment_intent_id).first()
		elif order_id:
			payment = Payment.objects.filter(order_id=order_id).first()

		if payment:
			payment.webhook_event_id = event.get("id", "")
			payment.webhook_event_type = event_type
			payment.webhook_received_at = datetime.utcnow()
			if event_type in ["payment_intent.succeeded", "checkout.session.completed"]:
				payment.status = "succeeded"
				payment.order.status = "paid"
				payment.order.save(update_fields=["status"])
			elif event_type in ["payment_intent.payment_failed"]:
				payment.status = "failed"
				payment.order.status = "pending"
				payment.order.save(update_fields=["status"])
			payment.save(update_fields=["webhook_event_id", "webhook_event_type", "webhook_received_at", "status"])

		return Response({"received": True, "event_type": event_type})

# Create your views here.
