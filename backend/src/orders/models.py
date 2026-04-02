from django.conf import settings
from django.db import models

from accounts.models import Address

from catalog.models import Product


class Order(models.Model):
	STATUS_CHOICES = (
		("pending", "Pending"),
		("paid", "Paid"),
		("processing", "Processing"),
		("shipped", "Shipped"),
		("delivered", "Delivered"),
		("cancelled", "Cancelled"),
	)

	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
	shipping_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name="shipping_orders")
	billing_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name="billing_orders")
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
	total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	tracking_number = models.CharField(max_length=80, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"Order #{self.id} - {self.user.username}"


class OrderItem(models.Model):
	order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
	product = models.ForeignKey(Product, on_delete=models.PROTECT)
	unit_price = models.DecimalField(max_digits=10, decimal_places=2)
	quantity = models.PositiveIntegerField(default=1)

	def __str__(self):
		return f"{self.product.name} x {self.quantity}"

# Create your models here.
