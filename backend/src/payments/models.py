from django.conf import settings
from django.db import models

from orders.models import Order


class Payment(models.Model):
	STATUS_CHOICES = (
		("created", "Created"),
		("succeeded", "Succeeded"),
		("failed", "Failed"),
	)

	order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments")
	provider = models.CharField(max_length=30, default="stripe")
	provider_payment_id = models.CharField(max_length=200, blank=True)
	amount = models.DecimalField(max_digits=10, decimal_places=2)
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="created")
	webhook_event_id = models.CharField(max_length=200, blank=True)
	webhook_event_type = models.CharField(max_length=120, blank=True)
	webhook_received_at = models.DateTimeField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Payment<{self.order_id}>"

# Create your models here.
