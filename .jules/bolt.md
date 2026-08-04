## 2024-05-24 - [Django REST Framework N+1 on Nested Serializers]
**Learning:** DRF nested serializers and SerializerMethodField that fetch related data cause massive N+1 queries if the base queryset isn't optimized. For `DoctorProfileViewSet`, not using `select_related` and `prefetch_related` created a hidden N+1 bottleneck when serializing user details and reviews.
**Action:** When working with Django REST Framework viewsets using nested serializers, explicitly use `select_related` for foreign key/one-to-one relations and `prefetch_related` for reverse/many-to-many relations in the queryset.

## 2024-08-04 - [Django REST Framework N+1 in AppointmentViewSet]
**Learning:** Similar to DoctorProfileViewSet, `AppointmentViewSet` suffered from severe N+1 queries when fetching list of appointments. Because it uses nested `DoctorProfileSerializer` and `HospitalProfileSerializer`, we were doing individual database queries for doctors' reviews, reviews' patients, hospital's departments and facilities for every appointment in the list.
**Action:** When working with Django REST Framework nested serializers and nested relations in `SerializerMethodField`s, make sure to deep-dive into the nested models. Always add the corresponding `prefetch_related` and `select_related` for nested fields like `doctor__reviews`, `hospital__facilities` to eliminate N+1 queries.
