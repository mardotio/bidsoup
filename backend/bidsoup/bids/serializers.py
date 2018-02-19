from .models import Bid, BidTask, BidItem, Category, Customer, UnitType
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField


class BidSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bid
        fields = ('id', 'name', 'description', 'bid_date', 'customer', 'tax_percent')

class BidItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BidItem
        fields = ('id', 'bid', 'unit_type', 'price', 'description', 'notes', 'category', 'markup_percent', 'quantity', 'parent')

class BidTaskSerializer(serializers.HyperlinkedModelSerializer):
    children = serializers.ListField(source='children.all', read_only=True, child=RecursiveField())

    class Meta:
        model = BidTask
        fields = ('id', 'parent', 'children', 'bid', 'title', 'description')

class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'bid', 'name', 'description', 'markup_percent', 'color')

class CustomerSerializer(serializers.HyperlinkedModelSerializer):
    class BidSer(serializers.HyperlinkedModelSerializer):
        class Meta:
            model = Bid
            fields = ('id', 'name', 'bid_date')

    #TODO Don't need this probably
    bid_set = BidSer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = ('id', 'name', 'email', 'phone', 'bid_set')

class UnitTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UnitType
        fields = ('id', 'name', 'description', 'unit', 'unit_price')
