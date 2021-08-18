from .models import Account, MagicLink
import re
from django.db import transaction, IntegrityError

def confirm_user(magic_link):
    ml = MagicLink.objects.filter(link=magic_link).get()
    user = ml.user
    with transaction.atomic():
        # Create a test account until we have a better way to associate the user
        name = re.search(r'\w+', user.email)[0].lower()

        # Check for similar slugs
        similar = list(Account.objects.filter(slug__startswith=name))
        similar = [a.slug for a in similar]
        if name in similar:
            i = 1
            test = f'{name}-{i}'
            while test in similar:
                i = i + 1
                test = f'{name}-{i}'

            name = test

        account = Account(name=name, slug=name)
        account.save()

        user.accounts.add(account)
        user.is_active = True
        user.save()
        ml.delete()


def delete_user(magic_link):
    ml = MagicLink.objects.filter(link=magic_link).get()
    ml.user.delete()
    ml.delete()
