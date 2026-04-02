from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
	name = models.CharField(max_length=100, unique=True)
	slug = models.SlugField(max_length=120, unique=True, blank=True)

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = slugify(self.name)
		super().save(*args, **kwargs)

	def __str__(self):
		return self.name


class Product(models.Model):
	category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
	name = models.CharField(max_length=180)
	slug = models.SlugField(max_length=220, unique=True, blank=True)
	description = models.TextField()
	price = models.DecimalField(max_digits=10, decimal_places=2)
	stock = models.PositiveIntegerField(default=0)
	is_active = models.BooleanField(default=True)
	created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = slugify(self.name)
		super().save(*args, **kwargs)

	def __str__(self):
		return self.name


class ProductImage(models.Model):
	product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
	image_url = models.URLField(max_length=500)
	alt_text = models.CharField(max_length=120, blank=True)
	is_primary = models.BooleanField(default=False)

	def __str__(self):
		return f"{self.product.name} image"

# Create your models here.
