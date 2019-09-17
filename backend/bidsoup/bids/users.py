from .models import MagicLink
from django.db import transaction

def confirm_user(magic_link):
    ml = MagicLink.objects.filter(link=magic_link).get()
    user = ml.user
    with transaction.atomic():
        user.is_active = True
        user.save()
        ml.delete()

def delete_user(magic_link):
    ml = MagicLink.objects.filter(link=magic_link).get()
    ml.user.delete()
    ml.delete()
