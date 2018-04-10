from .models import Bid, BidTask, BidItem, Category, Customer, UnitType
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField


class BidSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bid
        fields = ('url', 'name', 'description', 'bid_date', 'customer', 'tax_percent')

class BidItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BidItem
        fields = ('url', 'bid', 'unit_type', 'price', 'description', 'notes', 'category', 'markup_percent', 'quantity', 'parent')

class BidTaskSerializer(serializers.HyperlinkedModelSerializer):
    children = serializers.ListField(source='children.all', read_only=True, child=RecursiveField())

    class Meta:
        model = BidTask
        fields = ('url', 'parent', 'children', 'bid', 'title', 'description')

class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ('url', 'bid', 'name', 'description', 'markup_percent', 'color')

class CustomerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Customer
        fields = ('url', 'name', 'email', 'phone')

class UnitTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UnitType
        fields = ('url', 'name', 'description', 'unit', 'unit_price')
