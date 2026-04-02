from rest_framework import generics, permissions

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryListView(generics.ListCreateAPIView):
	queryset = Category.objects.all().order_by("name")
	serializer_class = CategorySerializer

	def get_permissions(self):
		if self.request.method == "POST":
			return [permissions.IsAdminUser()]
		return [permissions.AllowAny()]


class ProductListCreateView(generics.ListCreateAPIView):
	queryset = Product.objects.filter(is_active=True).select_related("category").prefetch_related("images").order_by("-id")
	serializer_class = ProductSerializer
	search_fields = ["name", "description", "category__name"]
	filterset_fields = ["category", "is_active"]
	ordering_fields = ["price", "created_at", "name"]

	def get_queryset(self):
		queryset = super().get_queryset()
		min_price = self.request.query_params.get("min_price")
		max_price = self.request.query_params.get("max_price")
		category_slug = self.request.query_params.get("category_slug")

		if min_price:
			queryset = queryset.filter(price__gte=min_price)
		if max_price:
			queryset = queryset.filter(price__lte=max_price)
		if category_slug:
			queryset = queryset.filter(category__slug=category_slug)
		return queryset

	def get_permissions(self):
		if self.request.method == "POST":
			return [permissions.IsAdminUser()]
		return [permissions.AllowAny()]

	def perform_create(self, serializer):
		serializer.save(created_by=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Product.objects.all()
	serializer_class = ProductSerializer
	lookup_field = "id"

	def get_permissions(self):
		if self.request.method == "GET":
			return [permissions.AllowAny()]
		return [permissions.IsAdminUser()]


class ProductImageCreateView(generics.CreateAPIView):
	serializer_class = ProductSerializer
	permission_classes = [permissions.IsAdminUser]

	def create(self, request, *args, **kwargs):
		product = Product.objects.filter(id=kwargs.get("id")).first()
		if not product:
			from rest_framework.response import Response
			from rest_framework import status
			return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

		image_url = request.data.get("image_url")
		alt_text = request.data.get("alt_text", "")
		is_primary = request.data.get("is_primary", False)
		if not image_url:
			from rest_framework.response import Response
			from rest_framework import status
			return Response({"detail": "image_url is required."}, status=status.HTTP_400_BAD_REQUEST)

		from .models import ProductImage

		if is_primary:
			ProductImage.objects.filter(product=product).update(is_primary=False)
		ProductImage.objects.create(
			product=product,
			image_url=image_url,
			alt_text=alt_text,
			is_primary=bool(is_primary),
		)

		from rest_framework.response import Response
		return Response(ProductSerializer(product).data)


class ProductImageDeleteView(generics.DestroyAPIView):
	permission_classes = [permissions.IsAdminUser]

	def get_queryset(self):
		from .models import ProductImage
		return ProductImage.objects.all()

# Create your views here.
