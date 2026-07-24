import uuid
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date

# Import models
from accounts.models import Role, OTP
from hospitals.models import HospitalProfile, Department, HospitalDepartmentRelation, Bed, Facility
from doctors.models import DoctorProfile, Review
from patients.models import PatientProfile, MedicalRecord
from appointments.models import Appointment, Prescription
from medicines.models import MedicineCategory, Medicine
from pharmacy.models import MedicineOrder, OrderItem, PharmacyProfile
from diagnostics.models import DiagnosticCenter, DiagnosticTest, TestBooking
from ambulance.models import Ambulance, AmbulanceBooking
from payments.models import PaymentTransaction, Invoice

User = get_user_model()

class Command(BaseCommand):
    help = "Seed database with mock medical data for Purnia Care dashboards"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Clearing existing databases (except users)..."))
        
        # Safe clean for seeding
        HospitalProfile.objects.all().hard_delete()
        Department.objects.all().hard_delete()
        MedicineCategory.objects.all().hard_delete()
        DiagnosticCenter.objects.all().hard_delete()
        Ambulance.objects.all().hard_delete()
        
        self.stdout.write(self.style.SUCCESS("Database tables cleared."))

        # 1. Create Core Users
        self.stdout.write("Seeding User Profiles...")
        
        # Clear specific users first
        User.objects.filter(email__in=[
            "patient@purniacare.com", "doctor@purniacare.com", 
            "hospital@purniacare.com", "admin@purniacare.com", "labs@purniacare.com",
            "pharmacy@purniacare.com"
        ]).delete()

        admin_user = User.objects.create_user(
            username="pc_admin",
            email="admin@purniacare.com",
            password="password123",
            first_name="Admin",
            last_name="System",
            role=Role.SUPER_ADMIN,
            city="Purnia",
            phone="+91 99999 88888"
        )

        doc_user = User.objects.create_user(
            username="dr_kumar",
            email="doctor@purniacare.com",
            password="password123",
            first_name="Rajesh",
            last_name="Kumar",
            role=Role.DOCTOR,
            city="Purnia",
            phone="+91 94321 00987"
        )

        hosp_user = User.objects.create_user(
            username="hosp_admin",
            email="hospital@purniacare.com",
            password="password123",
            first_name="Purnia Care",
            last_name="Admin",
            role=Role.HOSPITAL_ADMIN,
            city="Purnia",
            phone="+91 6454 224488"
        )

        patient_user = User.objects.create_user(
            username="aman_verma",
            email="patient@purniacare.com",
            password="password123",
            first_name="Aman",
            last_name="Verma",
            role=Role.PATIENT,
            city="Purnia",
            phone="+91 98765 43210",
            blood_group="O+ve",
            dob=date(1994, 8, 15)
        )

        lab_user = User.objects.create_user(
            username="pc_lab_tech",
            email="labs@purniacare.com",
            password="password123",
            first_name="Lal Path",
            last_name="Technician",
            role=Role.DIAGNOSTIC_ADMIN,
            city="Purnia",
            phone="+91 99887 76655"
        )

        pharmacy_user = User.objects.create_user(
            username="pc_pharmacy",
            email="pharmacy@purniacare.com",
            password="password123",
            first_name="Purnia Care",
            last_name="Pharmacy",
            role=Role.PHARMACY_ADMIN,
            city="Purnia",
            phone="+91 99999 55555"
        )

        pharm_profile = PharmacyProfile.objects.create(
            user=pharmacy_user,
            name="Purnia Care Central Pharmacy",
            owner_name="Sanjay Gupta",
            drug_license_number="DL-98765-PUR",
            gst_number="20AAECP9876F1Z5",
            address="Line Bazar Chowk, Purnia, Bihar - 854301",
            city="Purnia",
            phone="+91 99999 55555",
            email="pharmacy@purniacare.com",
            store_timings="8:00 AM - 10:00 PM",
            home_delivery_available=True,
            kyc_status=PharmacyProfile.KycStatus.APPROVED,
            delivery_charges=30.00
        )

        # 2. Seeding Hospitals
        self.stdout.write("Seeding Hospitals & Departments...")
        h1 = HospitalProfile.objects.create(
            name="Purnia Care Central Hospital",
            address="NH-31, Line Bazar, Purnia, Bihar - 854301",
            city="Purnia",
            phone="+91 6454 224488",
            email="info@purniacare.com",
            beds_count=250,
            image="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600",
            description="Leading tertiary care facility offering comprehensive medical services."
        )
        Facility.objects.create(hospital=h1, name="24/7 ICU")
        Facility.objects.create(hospital=h1, name="Blood Bank")
        Facility.objects.create(hospital=h1, name="Trauma Center")
        Bed.objects.create(hospital=h1, room_number="ICU-101", bed_type=Bed.BedType.ICU, is_occupied=False)
        Bed.objects.create(hospital=h1, room_number="ICU-102", bed_type=Bed.BedType.ICU, is_occupied=True)

        h2 = HospitalProfile.objects.create(
            name="Sadar District Hospital Purnia",
            address="Rambagh Road, Purnia, Bihar - 854301",
            city="Purnia",
            phone="+91 6454 223344",
            email="sadar.purnia@bihar.gov.in",
            beds_count=180,
            image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
            description="The primary government district medical center in Purnia."
        )

        d1 = Department.objects.create(name="Cardiology", description="Heart care and surgery")
        d2 = Department.objects.create(name="Pediatrics", description="Child specialist")
        d3 = Department.objects.create(name="Orthopedics", description="Bones and joints")
        d4 = Department.objects.create(name="Dermatology", description="Skin care")

        HospitalDepartmentRelation.objects.create(hospital=h1, department=d1)
        HospitalDepartmentRelation.objects.create(hospital=h1, department=d2)
        HospitalDepartmentRelation.objects.create(hospital=h1, department=d4)
        HospitalDepartmentRelation.objects.create(hospital=h2, department=d2)
        HospitalDepartmentRelation.objects.create(hospital=h2, department=d3)

        # 3. Doctor Profile Setup
        self.stdout.write("Seeding Doctor Profiles...")
        doc_profile = DoctorProfile.objects.create(
            user=doc_user,
            specialization=d1,
            qualification="MD, DM (Cardiology) - AIIMS",
            experience=15,
            fees=800,
            hospital=h1,
            available_days=["Mon", "Wed", "Fri"],
            available_time="10:00 AM - 01:00 PM",
            is_verified=True,
            description="Senior Consultant Cardiologist specializing in preventive cardiac screening."
        )
        
        # Reviews
        Review.objects.create(
            doctor=doc_profile,
            patient=patient_user,
            rating=5,
            comment="Dr. Rajesh is exceptionally thorough. Highly recommend his preventive checks."
        )

        # 4. Patient Profile Setup
        self.stdout.write("Seeding Patient Profiles...")
        pat_profile = PatientProfile.objects.create(
            user=patient_user,
            emergency_contact_name="Raman Verma",
            emergency_contact_phone="+91 99887 76655",
            allergies="Peanuts, Penicillin",
            family_history="History of hypertension"
        )
        
        # Medical record
        MedicalRecord.objects.create(
            patient=pat_profile,
            title="Baseline CBC Panel",
            record_type=MedicalRecord.RecordType.REPORT,
            date=date(2026, 7, 12),
            description="General health checkup blood report.",
            file_path="/media/records/cbc_aman.pdf"
        )

        # 5. Seeding Inventory Medicines
        self.stdout.write("Seeding Pharmacy & Inventory...")
        mc1 = MedicineCategory.objects.create(name="Pain Reliever & Fever")
        mc2 = MedicineCategory.objects.create(name="Acidity & Gas")
        mc3 = MedicineCategory.objects.create(name="Heart & Cholesterol")

        m1 = Medicine.objects.create(
            name="Paracetamol 650mg (Dolo)",
            category=mc1,
            pharmacy=pharm_profile,
            brand="Micro Labs",
            generic_name="Paracetamol",
            manufacturer="Micro Labs Ltd",
            batch_number="DOL-1029",
            expiry_date=date(2027, 10, 15),
            purchase_price=22.00,
            mrp=40.00,
            price=32.00,
            discount=15,
            stock=500,
            dosage_instructions="One tablet when required or as prescribed.",
            image="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300",
            prescription_required=False
        )

        m2 = Medicine.objects.create(
            name="Pantoprazole 40mg (Pan-D)",
            category=mc2,
            pharmacy=pharm_profile,
            brand="Alkem",
            generic_name="Pantoprazole",
            manufacturer="Alkem Laboratories",
            batch_number="PND-9923",
            expiry_date=date(2026, 8, 30), # near expiry
            purchase_price=110.00,
            mrp=168.00,
            price=148.00,
            discount=12,
            stock=15, # low stock
            dosage_instructions="One tablet morning before breakfast.",
            image="https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=300",
            prescription_required=True
        )

        # 6. Diagnostics Centers
        self.stdout.write("Seeding Laboratory Diagnostics...")
        dc = DiagnosticCenter.objects.create(
            name="Purnia Care Central Labs",
            address="NH-31, Line Bazar, Purnia",
            city="Purnia",
            phone="+91 6454 224499",
            email="labs@purniacare.com",
            image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"
        )

        DiagnosticTest.objects.create(
            center=dc,
            name="Complete Blood Count (CBC)",
            category="Blood Test",
            price=299,
            others_avg_price=450,
            duration="4 Hours",
            instructions="No fasting required."
        )

        DiagnosticTest.objects.create(
            center=dc,
            name="HbA1c (Glycated Haemoglobin)",
            category="Diabetic Profile",
            price=349,
            others_avg_price=550,
            duration="6 Hours",
            instructions="No fasting required."
        )

        # 7. Ambulances
        self.stdout.write("Seeding Emergency Fleet...")
        Ambulance.objects.create(
            type=Ambulance.AmbulanceType.BLS,
            driver_name="Ramesh Prasad",
            vehicle_number="BR-11P-4521",
            phone="+91 99341 55667",
            status=Ambulance.AmbulanceStatus.AVAILABLE,
            charge_per_km=15,
            eta_minutes=12,
            location_name="Line Bazar Crossway"
        )
        Ambulance.objects.create(
            type=Ambulance.AmbulanceType.ALS,
            driver_name="Manoj Yadav",
            vehicle_number="BR-11D-8977",
            phone="+91 91223 88443",
            status=Ambulance.AmbulanceStatus.ON_TRIP,
            charge_per_km=30,
            eta_minutes=25,
            location_name="Bhatta Bazar Road"
        )

        # 8. Appointments & Payments History
        self.stdout.write("Seeding Appointment Bookings & Payments...")
        apt = Appointment.objects.create(
            patient=patient_user,
            doctor=doc_profile,
            hospital=h1,
            date=date(2026, 7, 22),
            time="10:30 AM",
            reason="Routine cardiac screening for blood pressure concerns.",
            status=Appointment.AppointmentStatus.UPCOMING,
            fees=800
        )

        past_apt = Appointment.objects.create(
            patient=patient_user,
            doctor=doc_profile,
            hospital=h1,
            date=date(2026, 7, 10),
            time="03:00 PM",
            reason="Regular cardiac checkup follow-up.",
            status=Appointment.AppointmentStatus.COMPLETED,
            fees=800
        )

        Prescription.objects.create(
            appointment=past_apt,
            notes="Limit salt intake. Monitor blood pressure daily.",
            medicines=[{"name": "Atorvastatin 10mg", "dosage": "1 tablet at night"}]
        )

        # Payment Transaction
        tx = PaymentTransaction.objects.create(
            user=patient_user,
            appointment=apt,
            transaction_id="tx-PC" + uuid.uuid4().hex[:8].upper(),
            amount=800.00,
            payment_method="UPI",
            status=PaymentTransaction.PaymentStatus.SUCCESS
        )

        Invoice.objects.create(
            payment=tx,
            invoice_number="INV-APT-8801",
            pdf_path="/media/invoices/inv_8801.pdf"
        )

        # Pharmacy Order
        order = MedicineOrder.objects.create(
            user=patient_user,
            pharmacy=pharm_profile,
            subtotal=180.00,
            tax=9.00,
            delivery_charge=30.00,
            total=219.00,
            status=MedicineOrder.OrderStatus.DELIVERED,
            payment_method="Cash on Delivery",
            address="Bhatia Chowk, Ward 12, Purnia, Bihar",
            prescription_image="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        )

        OrderItem.objects.create(
            order=order,
            medicine=m1,
            quantity=2,
            price=32.00,
            discount=15
        )

        self.stdout.write(self.style.SUCCESS("Database successfully seeded with Purnia Care clinical mock datasets!"))
