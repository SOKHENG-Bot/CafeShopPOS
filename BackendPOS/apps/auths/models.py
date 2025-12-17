from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True, blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    USERNAME_FIELD = "username"  # use for authication
    # use for createsuperuser if ["email"] -> createsuperuser required create with email
    REQUIRED_FIELDS = []

    def __str__(self) -> str:
        return self.username
