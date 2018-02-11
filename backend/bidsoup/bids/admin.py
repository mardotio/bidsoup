from django.contrib import admin

from .models import Customer, Category, UnitType, BidItem, BidTask, Bid, BidTask

admin.site.register(Bid)
admin.site.register(BidItem)
admin.site.register(BidTask)
admin.site.register(UnitType)
admin.site.register(Customer)
admin.site.register(Category)
