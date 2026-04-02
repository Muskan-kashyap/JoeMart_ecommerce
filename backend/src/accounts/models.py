from django.conf import settings
from django.db import models


class Address(models.Model):
	ADDRESS_TYPES = (
		("shipping", "Shipping"),
		("billing", "Billing"),
	)

	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="addresses")
	address_type = models.CharField(max_length=20, choices=ADDRESS_TYPES, default="shipping")
	full_name = models.CharField(max_length=120)
	line_1 = models.CharField(max_length=180)
	line_2 = models.CharField(max_length=180, blank=True)
	city = models.CharField(max_length=90)
	state = models.CharField(max_length=90)
	postal_code = models.CharField(max_length=20)
	country = models.CharField(max_length=60, default="India")
	is_default = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.user.username} - {self.address_type}"

# Create your models here.
