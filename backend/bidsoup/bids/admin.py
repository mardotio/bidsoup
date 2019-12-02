from django.contrib import admin

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models import Account, Customer, Category, UnitType, BidItem, BidTask, Bid, BidTask, User, MagicLink, Invitation

class UserAdmin(BaseUserAdmin):
    """
    https://stackoverflow.com/questions/15012235/using-django-auth-useradmin-for-a-custom-user-model
    """
    model = User
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('account',)}),
    )




admin.site.register(Account)
admin.site.register(Bid)
admin.site.register(BidItem)
admin.site.register(BidTask)
admin.site.register(Customer)
admin.site.register(Category)
admin.site.register(UnitType)
admin.site.register(User, UserAdmin)
admin.site.register(Invitation)
admin.site.register(MagicLink)
