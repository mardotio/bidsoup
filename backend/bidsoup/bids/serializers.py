from .models import Account, Bid, BidTask, BidItem, Category, Customer, UnitType, User
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField
from rest_framework_nested.relations import NestedHyperlinkedRelatedField, NestedHyperlinkedIdentityField

def get_max_digit_field_value(digit_field):
    """
    Helper to retrieve the max value (useful for OPTIONS) from the max_digits
    and decimal_places attributes of a DigitField
    """
    upper_bound = 1 * 10 ** (digit_field.max_digits - digit_field.decimal_places)
    smallest_value = 1 * 10 ** -digit_field.decimal_places
    return upper_bound - smallest_value

class AccountSerializer(serializers.HyperlinkedModelSerializer):

    bids = NestedHyperlinkedIdentityField(
        view_name='account-bid-list',
        lookup_url_kwarg='account_slug',
        lookup_field='slug',
        parent_lookup_kwargs={}
    )

    class Meta:
        model = Account
        fields = ('url', 'name', 'bids', 'slug')
        extra_kwargs = {
            'url': {'view_name': 'account-detail', 'lookup_field': 'slug'}
        }


class OptionalFieldsMixin:
    def __init__(self, *args, **kwargs):
        # Don't pass custom kwargs to super
        fields = kwargs.pop('fields', None)
        exclude_fields = kwargs.pop('exclude_fields', None)

        assert not (fields and exclude_fields), 'Cannot provide fields and exclude_fields'

        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop all fields not specified
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)
        elif exclude_fields is not None:
            # Remove all fields listed
            for field_name in exclude_fields:
                self.fields.pop(field_name)


class BidSerializer(OptionalFieldsMixin, serializers.HyperlinkedModelSerializer):
    account = serializers.HyperlinkedRelatedField(view_name='account-detail', lookup_field='slug', read_only=True)
    biditems = serializers.HyperlinkedIdentityField(view_name='bid-biditem-list', lookup_url_kwarg='bid_pk', many=False)
    bidtasks = serializers.HyperlinkedIdentityField(view_name='bid-bidtask-list', lookup_url_kwarg='bid_pk', many=False)
    categories = serializers.HyperlinkedIdentityField(view_name='bid-category-list', lookup_url_kwarg='bid_pk', many=False)

    class Meta:
        model = Bid
        fields = ('url', 'name', 'description', 'bid_date', 'account', 'customer', 'tax_percent',
            'biditems', 'bidtasks', 'categories', 'key')
        extra_kwargs = {
            'key': {'read_only': 'true'}
        }


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
        fields = ('url', 'bid', 'name', 'description', 'markup_percent', 'color', 'taxable', 'is_labor')

class CustomerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Customer
        fields = ('url', 'name', 'email', 'phone')

    def create(self, validated_data):
        # Set account from request.
        validated_data['account_id'] = self.context['request'].user.account_id
        return Customer.objects.create(**validated_data)

class UnitTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UnitType
        fields = ('url', 'name', 'description', 'unit', 'unit_price', 'category')
        extra_kwargs = {
            'unit_price': {'max_value': get_max_digit_field_value(model._meta.get_field('unit_price'))}
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128)

class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128)
    email = serializers.EmailField()
