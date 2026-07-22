// Mock Data for Purnia Care Hospital Management System

export const mockDoctors = [
  {
    id: "doc-1",
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiology",
    qualification: "MD, DM (Cardiology) - AIIMS",
    experience: 15,
    fees: 800,
    rating: 4.8,
    reviewsCount: 142,
    city: "Purnia",
    hospitalId: "hosp-1",
    hospitalName: "Purnia Care Central Hospital",
    availableDays: ["Mon", "Wed", "Fri"],
    availableTime: "10:00 AM - 01:00 PM",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
    description: "Senior Consultant Cardiologist with 15+ years of experience in interventional cardiology and preventive heart care.",
  },
  {
    id: "doc-2",
    name: "Dr. Anjali Sharma",
    specialization: "Pediatrics",
    qualification: "MD (Pediatrics), DCH - Mumbai University",
    experience: 12,
    fees: 600,
    rating: 4.9,
    reviewsCount: 198,
    city: "Purnia",
    hospitalId: "hosp-1",
    hospitalName: "Purnia Care Central Hospital",
    availableDays: ["Mon", "Tue", "Thu", "Sat"],
    availableTime: "02:00 PM - 05:00 PM",
    photo: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300",
    description: "Dedicated pediatrician focusing on child growth, immunizations, and developmental pediatrics.",
  },
  {
    id: "doc-3",
    name: "Dr. Amit Verma",
    specialization: "Orthopedics",
    qualification: "MS (Orthopedics) - KGMU",
    experience: 10,
    fees: 700,
    rating: 4.7,
    reviewsCount: 95,
    city: "Purnia",
    hospitalId: "hosp-2",
    hospitalName: "Sadar Hospital Purnia",
    availableDays: ["Tue", "Thu", "Sat"],
    availableTime: "11:00 AM - 03:00 PM",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    description: "Expert orthopedic surgeon specializing in joint replacement, sports injuries, and complex trauma surgeries.",
  },
  {
    id: "doc-4",
    name: "Dr. Priya Patel",
    specialization: "Gynecology",
    qualification: "MS (OBG), DNB - JIPMER",
    experience: 14,
    fees: 750,
    rating: 4.9,
    reviewsCount: 224,
    city: "Purnia",
    hospitalId: "hosp-3",
    hospitalName: "Max Care Clinic",
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    availableTime: "09:00 AM - 12:30 PM",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    description: "Specialist in high-risk obstetrics, laparoscopic gynecological surgeries, and infertility treatments.",
  },
  {
    id: "doc-5",
    name: "Dr. Sandeep Mishra",
    specialization: "Neurology",
    qualification: "MD, DM (Neurology) - NIMHANS",
    experience: 18,
    fees: 1000,
    rating: 4.6,
    reviewsCount: 88,
    city: "Katihar",
    hospitalId: "hosp-4",
    hospitalName: "Katihar Medical Hub",
    availableDays: ["Wed", "Sat"],
    availableTime: "01:00 PM - 04:00 PM",
    photo: "https://images.unsplash.com/photo-1622902047079-6309e60226c4?auto=format&fit=crop&q=80&w=300",
    description: "Reputed neurologist dealing with stroke, epilepsy, neuromuscular disorders, and chronic headaches.",
  },
  {
    id: "doc-6",
    name: "Dr. Sneha Roy",
    specialization: "Dermatology",
    qualification: "MD (Dermatology) - Patna Medical College",
    experience: 8,
    fees: 500,
    rating: 4.8,
    reviewsCount: 110,
    city: "Purnia",
    hospitalId: "hosp-1",
    hospitalName: "Purnia Care Central Hospital",
    availableDays: ["Tue", "Thu", "Fri"],
    availableTime: "04:30 PM - 07:30 PM",
    photo: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=300",
    description: "Consultant dermatologist specializing in clinical dermatology, acne therapy, anti-aging, and laser procedures.",
  },
  {
    id: "doc-7",
    name: "Dr. Vikram Singh",
    specialization: "Oncology",
    qualification: "MD (Medicine), DM (Medical Oncology) - Tata Memorial",
    experience: 16,
    fees: 900,
    rating: 4.9,
    reviewsCount: 76,
    city: "Purnia",
    hospitalId: "hosp-1",
    hospitalName: "Purnia Care Central Hospital",
    availableDays: ["Mon", "Thu"],
    availableTime: "12:00 PM - 03:00 PM",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
    description: "Expert in chemotherapy, immunotherapy, and targeted therapies for cancer management.",
  },
  {
    id: "doc-8",
    name: "Dr. Meera Sen",
    specialization: "Ophthalmology",
    qualification: "MS (Ophthalmology) - RP Centre AIIMS",
    experience: 11,
    fees: 550,
    rating: 4.7,
    reviewsCount: 135,
    city: "Purnia",
    hospitalId: "hosp-2",
    hospitalName: "Sadar Hospital Purnia",
    availableDays: ["Mon", "Wed", "Sat"],
    availableTime: "09:30 AM - 01:00 PM",
    photo: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300",
    description: "Cataract and refractive surgeon specialized in LASIK, glaucoma treatment, and pediatric eye care.",
  }
];

export const mockHospitals = [
  {
    id: "hosp-1",
    name: "Purnia Care Central Hospital",
    address: "NH-31, Line Bazar, Purnia, Bihar - 854301",
    rating: 4.7,
    reviewsCount: 450,
    city: "Purnia",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600",
    departments: ["Cardiology", "Pediatrics", "Dermatology", "Oncology", "General Medicine", "Emergency Care"],
    contact: "+91 6454 224488",
    email: "info@purniacare.com",
    bedsCount: 250,
    facilities: ["24/7 ICU", "Blood Bank", "Trauma Center", "Emergency Pharmacy", "Ambulance Hub"],
    description: "Purnia Care Central Hospital is the region's leading tertiary care facility, offering comprehensive healthcare services, state-of-the-art diagnostics, and highly qualified specialists.",
  },
  {
    id: "hosp-2",
    name: "Sadar District Hospital Purnia",
    address: "Rambagh Road, Purnia, Bihar - 854301",
    rating: 4.1,
    reviewsCount: 310,
    city: "Purnia",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
    departments: ["Orthopedics", "Ophthalmology", "General Medicine", "Maternity Ward", "Pediatrics"],
    contact: "+91 6454 223344",
    email: "sadar.purnia@bihar.gov.in",
    bedsCount: 180,
    facilities: ["Maternity Care", "General Wards", "Free Vaccines", "Emergency Response"],
    description: "The primary government district hospital in Purnia, providing affordable, accessible, and high-quality secondary healthcare services to the general public.",
  },
  {
    id: "hosp-3",
    name: "Max Care Super-Specialty Clinic",
    address: "Navratan Hatta, Purnia, Bihar - 854302",
    rating: 4.8,
    reviewsCount: 180,
    city: "Purnia",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600",
    departments: ["Gynecology", "Dermatology", "Endocrinology", "Pediatrics"],
    contact: "+91 99342 88442",
    email: "contact@maxcarepurnia.in",
    bedsCount: 30,
    facilities: ["Outpatient consultations", "Laparoscopy Unit", "Day Care Beds", "Diagnostics Lab"],
    description: "A premium boutique healthcare facility offering top-tier consulting rooms, personalized outpatient care, and advanced minor surgeries in a highly modern setting.",
  },
  {
    id: "hosp-4",
    name: "Katihar Medical Hub",
    address: "Mirchaibari, Katihar, Bihar - 854105",
    rating: 4.3,
    reviewsCount: 155,
    city: "Katihar",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
    departments: ["Neurology", "Cardiology", "Gastroenterology", "Urology"],
    contact: "+91 6452 245678",
    email: "admin@katiharmedhub.com",
    bedsCount: 120,
    facilities: ["Dialysis Wing", "Cath Lab", "CT Scan / MRI", "Emergency Trauma Center"],
    description: "Katihar's leading medical clinic and hospital specializing in neurological, nephrological, and cardiovascular care with 24/7 ICU assistance.",
  }
];

export const mockMedicines = [
  {
    id: "med-1",
    name: "Paracetamol 650mg (Dolo)",
    category: "Pain Reliever & Fever",
    price: 32,
    discount: 15, // percent
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300",
    description: "Effective in treating headaches, muscle aches, toothaches, joint pains, and reducing fever.",
    inStock: true,
    brand: "Micro Labs",
    dosage: "One tablet when required or as prescribed by a physician."
  },
  {
    id: "med-2",
    name: "Amoxicillin 500mg (Novamox)",
    category: "Antibiotics",
    price: 104,
    discount: 10,
    image: "https://images.unsplash.com/photo-1607619056574-7b8d304a2c23?auto=format&fit=crop&q=80&w=300",
    description: "Used to treat a wide variety of bacterial infections of the ear, nose, throat, skin, and urinary tract.",
    inStock: true,
    brand: "Cipla",
    dosage: "Take exactly as directed by your doctor. Complete the full course."
  },
  {
    id: "med-3",
    name: "Pantoprazole 40mg (Pan-D)",
    category: "Acidity & Gas",
    price: 148,
    discount: 12,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=300",
    description: "Helps reduce stomach acid production. Prevents heartburn, acid reflux, and stomach ulcers.",
    inStock: true,
    brand: "Alkem",
    dosage: "One tablet in the morning, 30 minutes before breakfast."
  },
  {
    id: "med-4",
    name: "Atorvastatin 10mg (Lipvas)",
    category: "Heart & Cholesterol",
    price: 85,
    discount: 8,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=300",
    description: "Prescribed to lower 'bad' LDL cholesterol and triglycerides in the blood, and to reduce the risk of stroke or heart attack.",
    inStock: true,
    brand: "Cipla",
    dosage: "Once daily, preferably at bedtime."
  },
  {
    id: "med-5",
    name: "Metformin 500mg (Glycomet)",
    category: "Diabetes",
    price: 24,
    discount: 5,
    image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=300",
    description: "Oral anti-diabetic medicine that helps control blood sugar levels in type 2 diabetes mellitus.",
    inStock: true,
    brand: "USV Ltd",
    dosage: "Take with meals as advised by your endocrinologist."
  },
  {
    id: "med-6",
    name: "Cetirizine 10mg (Okacet)",
    category: "Allergies & Cold",
    price: 18,
    discount: 20,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=300",
    description: "Provides relief from symptoms of allergic conditions such as hay fever, running nose, sneezing, and skin rashes.",
    inStock: true,
    brand: "Cipla",
    dosage: "One tablet daily before bed (may cause mild drowsiness)."
  },
  {
    id: "med-7",
    name: "Cough Syrup (Ascoril LS)",
    category: "Cough & Cold",
    price: 118,
    discount: 15,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300",
    description: "Mucolytic, bronchodilator, and expectorant syrup for relief from wet cough and chest congestion.",
    inStock: true,
    brand: "Glenmark",
    dosage: "5-10 ml, 2-3 times daily or as suggested by a doctor."
  },
  {
    id: "med-8",
    name: "Multivitamin Capsules (Zincovit)",
    category: "Vitamins & Supplements",
    price: 110,
    discount: 10,
    image: "https://images.unsplash.com/photo-1616671276441-2f0c27ae6302?auto=format&fit=crop&q=80&w=300",
    description: "Nutritional supplement packed with essential vitamins, minerals, and zinc to boost immunity and energy.",
    inStock: true,
    brand: "Apex Labs",
    dosage: "One tablet daily after any main meal."
  }
];

export const mockDiagnostics = [
  {
    id: "test-1",
    name: "Complete Blood Count (CBC)",
    description: "Evaluates overall health; screens for anemia, infections, leukemia, and platelet disorders.",
    category: "Blood Test",
    price: 299,
    comparison: { purniaCare: 299, othersAvg: 450 },
    duration: "Same Day (4 Hours)",
    instructions: "No fasting required."
  },
  {
    id: "test-2",
    name: "HbA1c (Glycated Haemoglobin)",
    description: "Measures average blood sugar levels over the past 3 months; vital for monitoring diabetes control.",
    category: "Diabetic Profile",
    price: 349,
    comparison: { purniaCare: 349, othersAvg: 550 },
    duration: "Same Day (6 Hours)",
    instructions: "No fasting required."
  },
  {
    id: "test-3",
    name: "Lipid Profile (Cholesterol Panel)",
    description: "Measures levels of good and bad cholesterol and triglycerides in blood to check heart risk.",
    category: "Heart Profile",
    price: 499,
    comparison: { purniaCare: 499, othersAvg: 799 },
    duration: "Next Day",
    instructions: "10-12 hours overnight fasting mandatory."
  },
  {
    id: "test-4",
    name: "Liver Function Test (LFT)",
    description: "Assesses liver enzymes, protein, and bilirubin levels to check liver health.",
    category: "Liver Profile",
    price: 599,
    comparison: { purniaCare: 599, othersAvg: 900 },
    duration: "Same Day",
    instructions: "Fasting recommended but not compulsory."
  },
  {
    id: "test-5",
    name: "Thyroid Profile (T3, T4, TSH)",
    description: "Evaluates thyroid gland function; helpful for diagnosing hypo- or hyper-thyroidism.",
    category: "Hormone Profile",
    price: 450,
    comparison: { purniaCare: 450, othersAvg: 650 },
    duration: "Same Day",
    instructions: "Fasting not required, morning sample preferred."
  },
  {
    id: "test-6",
    name: "Full Body Health Checkup (Purnia Care Platinum)",
    description: "Includes 72 parameters: CBC, LFT, KFT, Lipid Profile, Thyroid, Blood Sugar, Iron Levels, and Urine Routine.",
    category: "Full Body Package",
    price: 1499,
    comparison: { purniaCare: 1499, othersAvg: 2999 },
    duration: "24 Hours",
    instructions: "10-12 hours overnight fasting is strictly required."
  }
];

export const mockAmbulances = [
  {
    id: "amb-1",
    type: "Basic Life Support (BLS)",
    driver: "Ramesh Prasad",
    vehicleNumber: "BR-11P-4521",
    phone: "+91 99341 55667",
    status: "Available",
    chargePerKm: 15,
    etaMinutes: 12,
    locationName: "Line Bazar Crossway",
  },
  {
    id: "amb-2",
    type: "Advanced Life Support (ALS)",
    driver: "Manoj Yadav",
    vehicleNumber: "BR-11D-8977",
    phone: "+91 91223 88443",
    status: "On Trip",
    chargePerKm: 30,
    etaMinutes: 25,
    locationName: "Bhatta Bazar Road",
  },
  {
    id: "amb-3",
    type: "Neonatal/Pediatric Ambulance",
    driver: "Sukhdeo Kisku",
    vehicleNumber: "BR-11F-0210",
    phone: "+91 88776 54321",
    status: "Available",
    chargePerKm: 25,
    etaMinutes: 15,
    locationName: "Gulabbagh Mandi",
  },
  {
    id: "amb-4",
    type: "Basic Life Support (BLS)",
    driver: "Vikash Paswan",
    vehicleNumber: "BR-11P-1122",
    phone: "+91 94723 11009",
    status: "Available",
    chargePerKm: 15,
    etaMinutes: 8,
    locationName: "Khazanchi Road",
  }
];

export const mockFAQs = [
  {
    question: "How do I book an appointment with a doctor?",
    answer: "You can search for doctors in your city, filter by specialization and hospital on our 'Doctors' page. Once you find the doctor, click 'Book Appointment' to select a time slot and fill in patient details.",
  },
  {
    question: "Is there an additional charge for booking ambulances online?",
    answer: "No, Purnia Care offers direct booking from local operators with flat per-kilometer pricing and zero booking fee. You pay only for the distance traveled directly to the driver.",
  },
  {
    question: "How long does it take for medicine orders to arrive?",
    answer: "Medicines ordered before 6 PM in Purnia city limits are delivered on the same day. Orders placed after 6 PM or in outlying areas are delivered by noon the next day.",
  },
  {
    question: "Can I upload a prescription to order medicines or book diagnostic tests?",
    answer: "Yes, both our Medicine Store and Diagnostic Center pages allow you to click 'Upload Prescription'. Our team of pharmacists and lab specialists will review it, select the correct medicines/tests, and contact you for verification.",
  },
  {
    question: "How do I get my lab test reports?",
    answer: "Once the lab results are verified by the diagnostics partner, the report PDF is automatically uploaded to your Patient Dashboard. You will receive an SMS and Email notification with a download link.",
  }
];

export const mockReviews = [
  {
    id: "rev-1",
    user: "Sunita Kumari",
    role: "Patient",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    comment: "Purnia Care made it so easy to book an appointment for my mother's cardiac checkup. Dr. Rajesh Kumar is highly professional, and our test results came in 4 hours on the portal!",
  },
  {
    id: "rev-2",
    user: "Raman Sinha",
    role: "Patient",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    comment: "I used the Ambulance Booking service at midnight during an emergency. The driver arrived in 10 minutes, and the live tracking screen was exact. Incredible lifesaver!",
  },
  {
    id: "rev-3",
    user: "Md. Adil Sheikh",
    role: "Customer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    rating: 4.8,
    comment: "Ordering medicines online was very easy. The interface is clean, and the 15% flat discount is better than local physical medical stores. Highly recommended.",
  }
];

// Preloaded mock accounts
export const mockUsers = {
  patient: {
    email: "patient@purniacare.com",
    password: "password123",
    role: "patient",
    name: "Aman Verma",
    phone: "+91 98765 43210",
    city: "Purnia",
    bloodGroup: "O+ve",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    address: "Bhatia Chowk, Ward 12, Purnia, Bihar",
    dob: "1994-08-15"
  },
  doctor: {
    email: "doctor@purniacare.com",
    password: "password123",
    role: "doctor",
    id: "doc-1",
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiology",
    qualification: "MD, DM (Cardiology) - AIIMS",
    experience: 15,
    hospitalName: "Purnia Care Central Hospital",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150",
  },
  hospital: {
    email: "hospital@purniacare.com",
    password: "password123",
    role: "hospital",
    id: "hosp-1",
    name: "Purnia Care Central Hospital",
    address: "NH-31, Line Bazar, Purnia, Bihar",
    phone: "+91 6454 224488",
    avatar: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=150",
  },
  admin: {
    email: "admin@purniacare.com",
    password: "password123",
    role: "admin",
    name: "Global Administrator",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
  }
};

// Activity logs and records
export const mockAppointments = [
  {
    id: "apt-101",
    patientName: "Aman Verma",
    patientEmail: "patient@purniacare.com",
    patientPhone: "+91 98765 43210",
    doctorId: "doc-1",
    doctorName: "Dr. Rajesh Kumar",
    specialization: "Cardiology",
    date: "2026-07-22",
    time: "10:30 AM",
    status: "Upcoming",
    fees: 800,
    reason: "Routine cardiac screening for blood pressure concerns."
  },
  {
    id: "apt-102",
    patientName: "Aman Verma",
    patientEmail: "patient@purniacare.com",
    patientPhone: "+91 98765 43210",
    doctorId: "doc-2",
    doctorName: "Dr. Anjali Sharma",
    specialization: "Pediatrics",
    date: "2026-07-10",
    time: "03:00 PM",
    status: "Completed",
    fees: 600,
    reason: "Regular vaccination and general checkup for son.",
    prescription: {
      date: "2026-07-10",
      notes: "General development is excellent. Continue vitamins.",
      medicines: [
        { name: "Multivitamin Drops", dosage: "5 drops daily in the morning" }
      ]
    }
  },
  {
    id: "apt-103",
    patientName: "Sita Devi",
    patientEmail: "sita@example.com",
    patientPhone: "+91 88776 22114",
    doctorId: "doc-1",
    doctorName: "Dr. Rajesh Kumar",
    specialization: "Cardiology",
    date: "2026-07-20",
    time: "11:00 AM",
    status: "Upcoming",
    fees: 800,
    reason: "Post-surgery evaluation."
  },
  {
    id: "apt-104",
    patientName: "Ramesh Gupta",
    patientEmail: "ramesh@example.com",
    patientPhone: "+91 94321 00987",
    doctorId: "doc-1",
    doctorName: "Dr. Rajesh Kumar",
    specialization: "Cardiology",
    date: "2026-07-20",
    time: "12:15 PM",
    status: "Completed",
    fees: 800,
    reason: "Mild angina/chest discomfort.",
    prescription: {
      date: "2026-07-20",
      notes: "Limit salt intake, monitor BP daily.",
      medicines: [
        { name: "Atorvastatin 10mg", dosage: "1 tablet at night" },
        { name: "Paracetamol 650mg", dosage: "1 tablet if pain occurs" }
      ]
    }
  }
];

export const mockOrders = [
  {
    id: "ord-8801",
    userEmail: "patient@purniacare.com",
    date: "2026-07-18",
    items: [
      { id: "med-1", name: "Paracetamol 650mg (Dolo)", quantity: 2, price: 32, discount: 15 },
      { id: "med-3", name: "Pantoprazole 40mg (Pan-D)", quantity: 1, price: 148, discount: 12 }
    ],
    subtotal: 185,
    tax: 9,
    deliveryCharge: 30,
    total: 224,
    status: "Delivered",
    paymentMethod: "Cash on Delivery",
    address: "Bhatia Chowk, Ward 12, Purnia, Bihar"
  },
  {
    id: "ord-8802",
    userEmail: "patient@purniacare.com",
    date: "2026-07-20",
    items: [
      { id: "med-8", name: "Multivitamin Capsules (Zincovit)", quantity: 3, price: 110, discount: 10 }
    ],
    subtotal: 297,
    tax: 15,
    deliveryCharge: 30,
    total: 342,
    status: "In Transit",
    paymentMethod: "UPI (Online)",
    address: "Bhatia Chowk, Ward 12, Purnia, Bihar"
  }
];

export const mockReports = [
  {
    id: "rep-201",
    userEmail: "patient@purniacare.com",
    testName: "Complete Blood Count (CBC)",
    date: "2026-07-12",
    status: "Verified",
    labName: "Purnia Care Central Labs",
    patientName: "Aman Verma",
    results: [
      { parameter: "Haemoglobin", value: "14.2 g/dL", range: "13.0 - 17.0 g/dL", status: "Normal" },
      { parameter: "Red Blood Cell Count", value: "4.8 million/mcL", range: "4.5 - 5.5 million/mcL", status: "Normal" },
      { parameter: "White Blood Cell Count", value: "7,400 /mcL", range: "4,000 - 11,000 /mcL", status: "Normal" },
      { parameter: "Platelet Count", value: "2,50,000 /mcL", range: "1,50,000 - 4,50,000 /mcL", status: "Normal" }
    ]
  },
  {
    id: "rep-202",
    userEmail: "patient@purniacare.com",
    testName: "HbA1c (Glycated Haemoglobin)",
    date: "2026-07-12",
    status: "Verified",
    labName: "Purnia Care Central Labs",
    patientName: "Aman Verma",
    results: [
      { parameter: "HbA1c Value", value: "5.8 %", range: "< 5.7 % Normal, 5.7-6.4 % Prediabetic", status: "Prediabetic" },
      { parameter: "Estimated Average Glucose", value: "120 mg/dL", range: "70 - 100 mg/dL", status: "High" }
    ]
  }
];
