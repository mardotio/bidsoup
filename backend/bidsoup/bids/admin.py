from django.contrib import admin

from .models import Account, Customer, Category, UnitType, BidItem, BidTask, Bid, BidTask, User
from django.contrib.auth.models import Group

admin.site.register(Account)
admin.site.register(Bid)
admin.site.register(BidItem)
admin.site.register(BidTask)
admin.site.register(Customer)
admin.site.register(Category)
admin.site.register(UnitType)
admin.site.register(User)
