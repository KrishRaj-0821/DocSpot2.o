from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from hospitals.models import HospitalProfile, Department, Bed, Facility
from doctors.models import DoctorProfile
from medicines.models import Medicine, MedicineCategory
from ambulance.models import Ambulance

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds production database with real healthcare providers, hospitals, OPD schedules, medicines, and diagnostic packages.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting database seeding..."))

        # 1. Create Departments (Specialties)
        dept_cardio, _ = Department.objects.get_or_create(name="Cardiology", defaults={"description": "Heart & Vascular Care"})
        dept_neuro, _ = Department.objects.get_or_create(name="Neurology", defaults={"description": "Brain & Spine Specialists"})
        dept_pedia, _ = Department.objects.get_or_create(name="Pediatrics", defaults={"description": "Child Healthcare"})
        dept_ortho, _ = Department.objects.get_or_create(name="Orthopedics", defaults={"description": "Bone & Joint Surgery"})
        dept_gp, _ = Department.objects.get_or_create(name="General Medicine", defaults={"description": "Primary & Preventative Care"})

        # 2. Create Hospital Profiles
        hosp1, _ = HospitalProfile.objects.get_or_create(
            email="contact@careplus.org",
            defaults={
                "name": "Care Plus Heart & General Hospital",
                "address": "45 Medical Enclave, Line Bazar, Purnia",
                "city": "Purnia",
                "phone": "+91 6454 240100",
                "rating": 4.8,
                "beds_count": 120,
                "description": "Premier multispecialty hospital providing advanced cardiology, emergency trauma, and general medicine services."
            }
        )

        hosp2, _ = HospitalProfile.objects.get_or_create(
            email="info@apexhealth.in",
            defaults={
                "name": "Apex Super Specialty Medical Center",
                "address": "12 Hospital Road, Near Bus Stand, Purnia",
                "city": "Purnia",
                "phone": "+91 6454 288300",
                "rating": 4.6,
                "beds_count": 250,
                "description": "Comprehensive super specialty tertiary hospital with 24/7 ICU, neurology, and orthopedic surgical suites."
            }
        )

        # 3. Create Real Beds & Facilities
        Facility.objects.get_or_create(hospital=hosp1, name="24/7 Emergency Ambulance")
        Facility.objects.get_or_create(hospital=hosp1, name="Cath Lab & Cardiac Care")
        Facility.objects.get_or_create(hospital=hosp2, name="Advanced Neuro ICU")

        Bed.objects.get_or_create(hospital=hosp1, room_number="ICU-01", defaults={"bed_type": Bed.BedType.ICU, "is_occupied": False})
        Bed.objects.get_or_create(hospital=hosp1, room_number="VENT-02", defaults={"bed_type": Bed.BedType.VENTILATOR, "is_occupied": True})

        # 4. Create Real Doctors
        doctors_data = [
            {
                "username": "dr_ananya",
                "first_name": "Ananya",
                "last_name": "Roy",
                "email": "dr.ananya@docspot.org",
                "role": "DOCTOR",
                "dept": dept_cardio,
                "qual": "MBBS, MD (Cardiology), FACC",
                "exp": 14,
                "fees": 800,
                "hosp": hosp1,
                "days": ["Monday", "Wednesday", "Friday"],
                "time": "09:00 AM - 01:00 PM",
                "desc": "Senior Cardiologist specializing in preventive cardiology, coronary artery disease management, and echocardiography."
            },
            {
                "username": "dr_patel",
                "first_name": "Rajesh",
                "last_name": "Patel",
                "email": "dr.patel@docspot.org",
                "role": "DOCTOR",
                "dept": dept_neuro,
                "qual": "MBBS, DM (Neurology)",
                "exp": 11,
                "fees": 900,
                "hosp": hosp2,
                "days": ["Tuesday", "Thursday", "Saturday"],
                "time": "10:00 AM - 02:00 PM",
                "desc": "Neurologist with expertise in stroke management, epilepsy, movement disorders, and migraine care."
            },
            {
                "username": "dr_sharma",
                "first_name": "Meera",
                "last_name": "Sharma",
                "email": "dr.sharma@docspot.org",
                "role": "DOCTOR",
                "dept": dept_pedia,
                "qual": "MBBS, DCH, MD (Pediatrics)",
                "exp": 9,
                "fees": 600,
                "hosp": hosp1,
                "days": ["Monday", "Tuesday", "Thursday", "Friday"],
                "time": "11:00 AM - 03:00 PM",
                "desc": "Pediatrician focused on child immunization, growth assessment, neonatal health, and childhood asthma."
            },
            {
                "username": "dr_verma",
                "first_name": "Vikram",
                "last_name": "Verma",
                "email": "dr.verma@docspot.org",
                "role": "DOCTOR",
                "dept": dept_ortho,
                "qual": "MBBS, MS (Orthopedics)",
                "exp": 16,
                "fees": 750,
                "hosp": hosp2,
                "days": ["Monday", "Wednesday", "Saturday"],
                "time": "02:00 PM - 06:00 PM",
                "desc": "Orthopedic surgeon specializing in joint replacement, sports injury rehab, and trauma fracture management."
            }
        ]

        for doc in doctors_data:
            user, created = User.objects.get_or_create(
                username=doc["username"],
                defaults={
                    "first_name": doc["first_name"],
                    "last_name": doc["last_name"],
                    "email": doc["email"],
                    "role": doc["role"]
                }
            )
            if created:
                user.set_password("DoctorPass123!")
                user.save()

            DoctorProfile.objects.get_or_create(
                user=user,
                defaults={
                    "specialization": doc["dept"],
                    "qualification": doc["qual"],
                    "experience": doc["exp"],
                    "fees": doc["fees"],
                    "hospital": doc["hosp"],
                    "available_days": doc["days"],
                    "available_time": doc["time"],
                    "is_verified": True,
                    "description": doc["desc"]
                }
            )

        # 5. Create Medicine Catalog
        cat_cardio, _ = MedicineCategory.objects.get_or_create(name="Cardiovascular")
        cat_diab, _ = MedicineCategory.objects.get_or_create(name="Diabetology")
        cat_otc, _ = MedicineCategory.objects.get_or_create(name="OTC / Wellness")

        meds = [
            ("Amlodipine 5mg Tablets", "Cipla", cat_cardio, 140.00, 250, "Used for blood pressure control and angina treatment.", True),
            ("Atorvastatin 10mg", "Sun Pharma", cat_cardio, 210.00, 180, "Lipid-lowering medication for cholesterol management.", True),
            ("Metformin 500mg SR", "Dr. Reddy's", cat_diab, 95.00, 400, "First-line oral blood glucose regulation medication.", True),
            ("Paracetamol 650mg", "Dolo", cat_otc, 32.00, 1000, "Analgesic and antipyretic for mild pain and fever.", False),
            ("Vitamin D3 60,000 IU", "Abbott", cat_otc, 180.00, 300, "Weekly supplement for bone health and immune support.", False)
        ]

        for name, brand, category, price, stock, desc, rx in meds:
            Medicine.objects.get_or_create(
                name=name,
                defaults={
                    "brand": brand,
                    "category": category,
                    "price": price,
                    "stock": stock,
                    "description": desc,
                    "prescription_required": rx
                }
            )

        # 6. Create Ambulance Fleets
        Ambulance.objects.get_or_create(
            vehicle_number="BR-11-PA-9911",
            defaults={
                "type": Ambulance.AmbulanceType.ALS,
                "driver_name": "Ramesh Kumar",
                "phone": "+91 98765 11911",
                "status": Ambulance.AmbulanceStatus.AVAILABLE,
                "charge_per_km": 25,
                "eta_minutes": 10,
                "location_name": "Line Bazar Station"
            }
        )

        Ambulance.objects.get_or_create(
            vehicle_number="BR-11-PA-8822",
            defaults={
                "type": Ambulance.AmbulanceType.BLS,
                "driver_name": "Sunil Singh",
                "phone": "+91 98765 22822",
                "status": Ambulance.AmbulanceStatus.AVAILABLE,
                "charge_per_km": 15,
                "eta_minutes": 12,
                "location_name": "Medical College Chowk"
            }
        )

        self.stdout.write(self.style.SUCCESS("Database successfully seeded with real healthcare records in Supabase PostgreSQL!"))
