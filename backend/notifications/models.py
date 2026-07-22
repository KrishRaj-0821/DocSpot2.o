from django.db import models
from django.conf import settings
from common.models import BasePurniaModel

class Notification(BasePurniaModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False, db_index=True)

    class Meta:
        db_table = 'purnia_notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title} (Read: {self.is_read})"
