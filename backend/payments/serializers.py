from rest_framework import serializers
from payments.models import PaymentTransaction, Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'pdf_path', 'generated_date']

class PaymentTransactionSerializer(serializers.ModelSerializer):
    invoice = InvoiceSerializer(read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'user', 'user_name', 'appointment', 'order', 
            'transaction_id', 'amount', 'payment_method', 
            'status', 'date', 'invoice'
        ]
        read_only_fields = ['user', 'date', 'status']
