from django.urls import path

from .views import CategoryListView, ProductDetailView, ProductImageCreateView, ProductImageDeleteView, ProductListCreateView

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("products/", ProductListCreateView.as_view(), name="product-list-create"),
    path("products/<int:id>/", ProductDetailView.as_view(), name="product-detail"),
    path("products/<int:id>/images/", ProductImageCreateView.as_view(), name="product-image-create"),
    path("products/images/<int:pk>/", ProductImageDeleteView.as_view(), name="product-image-delete"),
]
