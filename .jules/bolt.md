## 2024-08-02 - DRF Viewsets N+1 Queries Bottleneck

**Learning:** Django REST Framework viewsets implicitly suffer from N+1 query problems when serializers include nested relationships (like foreign keys, reverse relationships, and `SerializerMethodField` referencing related models). The viewset's default queryset (e.g., `DoctorProfile.objects.all()`) doesn't automatically load related models, causing an avalanche of queries per instance during serialization.

**Action:** Whenever reviewing or updating a DRF ViewSet, inspect its Serializer. Ensure the ViewSet's `queryset` is optimized using `select_related()` for forward foreign key/one-to-one relations, and `prefetch_related()` for reverse/many-to-many relationships. Verify query reduction by profiling API requests locally.
