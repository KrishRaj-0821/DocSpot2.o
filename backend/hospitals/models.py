from django.db import models
from common.models import BasePurniaModel

class HospitalProfile(BasePurniaModel):
    name = models.CharField(max_length=200, db_index=True)
    address = models.TextField()
    city = models.CharField(max_length=50, default='Purnia', db_index=True)
    phone = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    image = models.URLField(max_length=500, blank=True, null=True)
    beds_count = models.IntegerField(default=100)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'purnia_hospitals'

    def __str__(self):
        return self.name

class Department(BasePurniaModel):
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'purnia_departments'

    def __str__(self):
        return self.name

class HospitalDepartmentRelation(BasePurniaModel):
    hospital = models.ForeignKey(HospitalProfile, on_delete=models.CASCADE, related_name='hospital_departments')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='department_hospitals')

    class Meta:
        db_table = 'purnia_hospital_department_relations'
        unique_together = ('hospital', 'department')

class Bed(BasePurniaModel):
    class BedType(models.TextChoices):
        GENERAL = 'general', 'General Ward'
        ICU = 'icu', 'ICU'
        VENTILATOR = 'ventilator', 'Ventilator'
        NICU = 'nicu', 'NICU'
        
    hospital = models.ForeignKey(HospitalProfile, on_delete=models.CASCADE, related_name='beds')
    room_number = models.CharField(max_length=20)
    bed_type = models.CharField(max_length=20, choices=BedType.choices, default=BedType.GENERAL)
    is_occupied = models.BooleanField(default=False)

    class Meta:
        db_table = 'purnia_beds'

class Facility(BasePurniaModel):
    hospital = models.ForeignKey(HospitalProfile, on_delete=models.CASCADE, related_name='facilities')
    name = models.CharField(max_length=100)

    class Meta:
        db_table = 'purnia_facilities'
