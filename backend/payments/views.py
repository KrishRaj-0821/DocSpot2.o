import uuid
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from payments.models import PaymentTransaction, Invoice
from payments.serializers import PaymentTransactionSerializer

class PaymentTransactionViewSet(viewsets.ModelViewSet):
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return self.queryset.filter(user=user)
        return self.queryset

    def create(self, request, *args, **kwargs):
        amount = request.data.get('amount')
        method = request.data.get('payment_method', 'UPI')
        
        if not amount:
            return Response({"detail": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Mock checkout transaction
        tx = PaymentTransaction.objects.create(
            user=request.user,
            amount=amount,
            payment_method=method,
            transaction_id=f"tx-{uuid.uuid4().hex[:10].upper()}",
            status=PaymentTransaction.PaymentStatus.SUCCESS
        )

        # Automatically issue invoice
        Invoice.objects.create(
            payment=tx,
            invoice_number=f"INV-{uuid.uuid4().hex[:8].upper()}",
            pdf_path=f"/media/invoices/inv-{tx.id}.pdf"
        )

        return Response(PaymentTransactionSerializer(tx).data, status=status.HTTP_201_CREATED)
