from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product

from .models import Cart, CartItem
from .serializers import CartSerializer


class CartView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		cart, _ = Cart.objects.get_or_create(user=request.user)
		return Response(CartSerializer(cart).data)


class CartItemAddView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		product_id = request.data.get("product")
		quantity = int(request.data.get("quantity", 1))

		product = Product.objects.filter(id=product_id, is_active=True).first()
		if not product:
			return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
		if quantity < 1 or quantity > product.stock:
			return Response({"detail": "Invalid quantity."}, status=status.HTTP_400_BAD_REQUEST)

		cart, _ = Cart.objects.get_or_create(user=request.user)
		item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={"quantity": quantity})
		if not created:
			item.quantity = min(product.stock, item.quantity + quantity)
			item.save(update_fields=["quantity"])
		return Response(CartSerializer(cart).data)


class CartItemUpdateDeleteView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def patch(self, request, item_id):
		item = CartItem.objects.filter(id=item_id, cart__user=request.user).first()
		if not item:
			return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

		quantity = int(request.data.get("quantity", item.quantity))
		if quantity < 1 or quantity > item.product.stock:
			return Response({"detail": "Invalid quantity."}, status=status.HTTP_400_BAD_REQUEST)

		item.quantity = quantity
		item.save(update_fields=["quantity"])
		return Response(CartSerializer(item.cart).data)

	def delete(self, request, item_id):
		item = CartItem.objects.filter(id=item_id, cart__user=request.user).first()
		if not item:
			return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

		cart = item.cart
		item.delete()
		return Response(CartSerializer(cart).data)

# Create your views here.
