from django.contrib import admin

from .models import Customer, Category, ItemType, BidItem, BidTask, Bid

admin.site.register(Bid)
admin.site.register(BidItem)
admin.site.register(ItemType)
admin.site.register(Customer)
admin.site.register(Category)
