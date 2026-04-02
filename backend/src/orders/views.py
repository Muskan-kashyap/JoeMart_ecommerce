from decimal import Decimal

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart
from accounts.models import Address

from .models import Order, OrderItem
from .serializers import OrderSerializer


class OrderListView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		orders = Order.objects.filter(user=request.user).order_by("-id")
		return Response(OrderSerializer(orders, many=True).data)


class OrderDetailView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request, order_id):
		order = Order.objects.filter(id=order_id, user=request.user).first()
		if not order:
			return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
		return Response(OrderSerializer(order).data)


class OrderCancelView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request, order_id):
		order = Order.objects.filter(id=order_id, user=request.user).first()
		if not order:
			return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
		if order.status in ["shipped", "delivered", "cancelled"]:
			return Response({"detail": "Order cannot be cancelled."}, status=status.HTTP_400_BAD_REQUEST)
		order.status = "cancelled"
		order.save(update_fields=["status", "updated_at"])
		return Response(OrderSerializer(order).data)


class CheckoutView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		cart = Cart.objects.filter(user=request.user).first()
		if not cart or not cart.items.exists():
			return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

		shipping_id = request.data.get("shipping_address_id")
		billing_id = request.data.get("billing_address_id")
		if not shipping_id or not billing_id:
			return Response({"detail": "Shipping and billing addresses are required."}, status=status.HTTP_400_BAD_REQUEST)

		shipping_address = Address.objects.filter(id=shipping_id, user=request.user).first()
		billing_address = Address.objects.filter(id=billing_id, user=request.user).first()
		if not shipping_address or not billing_address:
			return Response({"detail": "Invalid address selection."}, status=status.HTTP_400_BAD_REQUEST)

		order = Order.objects.create(
			user=request.user,
			status="pending",
			shipping_address=shipping_address,
			billing_address=billing_address,
		)
		total = Decimal("0.00")

		for item in cart.items.select_related("product"):
			unit_price = item.product.price
			OrderItem.objects.create(
				order=order,
				product=item.product,
				unit_price=unit_price,
				quantity=item.quantity,
			)
			total += unit_price * item.quantity

		order.total_amount = total
		order.save(update_fields=["total_amount"])
		cart.items.all().delete()

		return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class AdminOrderListView(APIView):
	permission_classes = [permissions.IsAdminUser]

	def get(self, request):
		orders = Order.objects.all().order_by("-id")
		return Response(OrderSerializer(orders, many=True).data)


class AdminOrderStatusUpdateView(APIView):
	permission_classes = [permissions.IsAdminUser]

	def patch(self, request, order_id):
		order = Order.objects.filter(id=order_id).first()
		if not order:
			return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

		next_status = request.data.get("status")
		tracking_number = request.data.get("tracking_number", "")
		allowed = {choice[0] for choice in Order.STATUS_CHOICES}

		if next_status not in allowed:
			return Response({"detail": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

		order.status = next_status
		if tracking_number:
			order.tracking_number = tracking_number
		order.save(update_fields=["status", "tracking_number", "updated_at"])

		return Response(OrderSerializer(order).data)

# Create your views here.
