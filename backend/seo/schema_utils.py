"""
DocSpot — Schema.org Structured Data Generators (JSON-LD)
Produces Google-compliant structured data for Physicians, Hospitals, and Medical Procedures.
"""

def generate_physician_schema(doctor_name, specialization, city, fee, photo_url, rating=4.9, review_count=120, slug=None):
    return {
        "@context": "https://schema.org",
        "@type": "Physician",
        "name": doctor_name,
        "image": photo_url or "https://docspot.vercel.app/og-default.jpg",
        "@id": f"https://docspot.vercel.app/doctor/{slug or 'dr-profile'}",
        "url": f"https://docspot.vercel.app/doctor/{slug or 'dr-profile'}",
        "priceRange": f"₹{fee}",
        "medicalSpecialty": specialization,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": city or "Purnia",
            "addressRegion": "Bihar",
            "addressCountry": "IN"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": str(rating),
            "reviewCount": str(review_count)
        }
    }


def generate_hospital_schema(hospital_name, city, bed_available_count=0):
    return {
        "@context": "https://schema.org",
        "@type": "Hospital",
        "name": hospital_name,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": city or "Purnia",
            "addressRegion": "Bihar",
            "addressCountry": "IN"
        },
        "medicalSpecialty": "Emergency Care",
        "availableService": {
            "@type": "MedicalProcedure",
            "name": f"ICU Bed & Emergency Service ({bed_available_count} Beds Available)"
        }
    }
