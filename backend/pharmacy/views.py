from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from pharmacy.models import MedicineOrder, OrderItem, PharmacyProfile
from pharmacy.serializers import MedicineOrderSerializer, PharmacyProfileSerializer
from medicines.models import Medicine
from common.permissions import IsPharmacyAdmin

class PharmacyProfileViewSet(viewsets.ModelViewSet):
    queryset = PharmacyProfile.objects.select_related('user').all() # Optimized: Added select_related to prevent N+1 queries
    serializer_class = PharmacyProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'pharmacy_admin':
            return self.queryset.filter(user=user)
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MedicineOrderViewSet(viewsets.ModelViewSet):
    queryset = MedicineOrder.objects.select_related('user', 'pharmacy').prefetch_related('items__medicine__category').all() # Optimized: Added select_related/prefetch_related to prevent N+1 queries
    serializer_class = MedicineOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return self.queryset.filter(user=user)
        elif user.role == 'pharmacy_admin':
            pharm = getattr(user, 'pharmacy_profile', None)
            if pharm:
                return self.queryset.filter(pharmacy=pharm)
            return self.queryset.none()
        return self.queryset

    def create(self, request, *args, **kwargs):
        items_data = request.data.get('items', [])
        if not items_data:
            return Response({"detail": "No items provided for the order"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch all medicines in a single query
        medicine_ids = [item['medicine'] for item in items_data]
        medicines_dict = Medicine.objects.in_bulk(medicine_ids)

        # Compute totals
        subtotal = 0
        order_items_to_create = []

        for item in items_data:
            med_id = item['medicine']
            if med_id not in medicines_dict:
                return Response({"detail": f"Medicine with id {med_id} not found"}, status=status.HTTP_400_BAD_REQUEST)
            
            med = medicines_dict[med_id]
            qty = int(item.get('quantity', 1))
            final_price = med.price - (med.price * med.discount / 100)
            subtotal += final_price * qty
            
            order_items_to_create.append({
                "medicine": med,
                "quantity": qty,
                "price": med.price,
                "discount": med.discount
            })

        from decimal import Decimal
        tax = subtotal * Decimal('0.05')
        delivery = Decimal('30')
        total = subtotal + tax + delivery

        # Get pharmacy
        pharmacy_id = request.data.get('pharmacy')

        # Create order
        order = MedicineOrder.objects.create(
            user=request.user,
            pharmacy_id=pharmacy_id,
            subtotal=subtotal,
            tax=tax,
            delivery_charge=delivery,
            total=total,
            payment_method=request.data.get('payment_method', 'Cash on Delivery'),
            address=request.data.get('address', request.user.address or ''),
            prescription_image=request.data.get('prescription_image')
        )

        # Create items
        OrderItem.objects.bulk_create([
            OrderItem(
                order=order,
                medicine=oi['medicine'],
                quantity=oi['quantity'],
                price=oi['price'],
                discount=oi['discount']
            ) for oi in order_items_to_create
        ])

        return Response(MedicineOrderSerializer(order).data, status=status.HTTP_201_CREATED)
