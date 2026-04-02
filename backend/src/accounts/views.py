from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Address
from .serializers import AddressSerializer, CustomTokenObtainPairSerializer, RegisterSerializer, UserSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
	serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
	serializer_class = RegisterSerializer
	permission_classes = [permissions.AllowAny]


class ProfileView(generics.GenericAPIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		return Response(UserSerializer(request.user).data)

	def put(self, request):
		serializer = UserSerializer(request.user, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data)


class AddressListCreateView(generics.ListCreateAPIView):
	serializer_class = AddressSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Address.objects.filter(user=self.request.user).order_by("-id")

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = AddressSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Address.objects.filter(user=self.request.user)

# Create your views here.
