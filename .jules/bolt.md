## 2024-05-24 - [Django REST Framework N+1 on Nested Serializers]
**Learning:** DRF nested serializers and SerializerMethodField that fetch related data cause massive N+1 queries if the base queryset isn't optimized. For `DoctorProfileViewSet`, not using `select_related` and `prefetch_related` created a hidden N+1 bottleneck when serializing user details and reviews.
**Action:** When working with Django REST Framework viewsets using nested serializers, explicitly use `select_related` for foreign key/one-to-one relations and `prefetch_related` for reverse/many-to-many relations in the queryset.
## 2024-05-18 - Bulk create objects
**Learning:** Creating multiple objects in a loop using `.create()` executes an N+1 query problem which severely degrades performance.
**Action:** Always prefer `Model.objects.bulk_create()` with a list comprehension for bulk inserting objects in Django.
## 2024-08-08 - Unoptimized Django Rest Framework ViewSet Querysets
**Learning:** By default, DRF ViewSets using `.objects.all()` paired with nested serializers (or `SerializerMethodField` referencing relations) generate severe N+1 query patterns. This is a common performance bottleneck specific to this codebase's architecture where many related models are eagerly serialized.
**Action:** Always inspect nested serializers for ViewSets and proactively apply `.select_related()` (for foreign keys) and `.prefetch_related()` (for many-to-many or reverse relations) at the base queryset level before releasing new endpoints.
