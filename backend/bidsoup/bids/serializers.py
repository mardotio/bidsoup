from .models import Account, AccountUser, Bid, BidTask, BidItem, Category, Customer, Invitation, UnitType, User
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField
from rest_framework_nested.relations import NestedHyperlinkedRelatedField, NestedHyperlinkedIdentityField
from rules import has_perm

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

    categories = NestedHyperlinkedIdentityField(
        view_name='account-category-list',
        lookup_url_kwarg='account_slug',
        lookup_field='slug',
        parent_lookup_kwargs={}
    )

    class Meta:
        model = Account
        fields = ('url', 'name', 'bids', 'categories', 'slug')
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
    children = serializers.ListField(source='get_ordered_children', read_only=True, child=RecursiveField())

    class Meta:
        model = BidTask
        fields = ('url', 'parent', 'children', 'bid', 'title', 'description')

class CategorySerializer(OptionalFieldsMixin, serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ('url', 'bid', 'name', 'description', 'markup_percent', 'color', 'taxable', 'is_labor', 'from_template', 'used_by')
        extra_kwargs = {
            'name': {'allow_blank': True},
            'color': {'allow_blank': True}
        }

    def update(self, instance, validated_data):
        from_template = validated_data.get('from_template')
        if instance.from_template != from_template:
            raise serializers.ValidationError('fromTemplate cannot be updated.')

        return super().update(instance, validated_data)


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

class AccountUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AccountUser
        fields = ('access_level', 'account')
        extra_kwargs = {
            'account': {'view_name': 'account-detail', 'lookup_field': 'slug', 'read_only': True}
        }

class UserSerializer(serializers.HyperlinkedModelSerializer):
    accounts = AccountUserSerializer(source='accountuser_set', many=True, read_only=True)

    class Meta:
        model = User
        fields = ('url', 'username', 'first_name', 'last_name', 'email', 'accounts',)
        extra_kwargs = {
            'url': {'view_name': 'user-detail', 'lookup_field': 'username'},
            'accounts': {'view_name': 'account-detail', 'lookup_field': 'slug', 'read_only': True}
        }


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128)


class InvitationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Invitation
        fields = ('url', 'invited_by', 'account', 'email', 'status')
        extra_kwargs = {
            'invited_by': {'lookup_field': 'username', 'read_only': True},
            'account': {'lookup_field': 'slug'},
            'status': {'read_only': True},
        }

    def save(self, **kwargs):
        user = kwargs.get('invited_by')
        account = self.validated_data.get('account')
        can_invite = has_perm('bids.invite_to_account', user, account)
        if not can_invite:
            raise serializers.ValidationError('Cannot invite user to non-owning account.')

        super().save(**kwargs)


class InvitationUpdateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Invitation
        fields = ('url', 'invited_by', 'account', 'email', 'status')
        # All fields are read-only _except_ status
        read_only_fields = ('url', 'invited_by', 'account', 'email',)
        extra_kwargs = {
            'invited_by': {'lookup_field': 'username'},
            'account': {'lookup_field': 'slug'},
        }

    def update(self, invitation, validated_data):
        """
        The only allowed updates are:
         - account managers: CREATED | SENT -> CANCELLED
         - invitee: SENT -> ACCEPTED | DECLINED
        """
        user = self.context.get('request').user
        new_status = validated_data.get('status')
        account_user = invitation.account.accountuser_set.filter(access_level__in=('OWNER', 'MANAGER',))
        account_managers = [u.user for u in list(account_user)]
        invitee = User.objects.filter(email=invitation.email).first()

        if invitee and invitee == user:
            if invitation.status == 'SENT' and new_status in ('ACCEPTED', 'DECLINED'):
                if new_status == 'ACCEPTED':
                    AccountUser.objects.create(user=user, account=invitation.account)
                return super().update(invitation, validated_data)
            else:
                raise serializers.ValidationError('Invalid status change.')

        if user in account_managers:
            if invitation.status in ('CREATED', 'SENT') and new_status == 'CANCELLED':
                return super().update(invitation, validated_data)
            else:
                raise serializers.ValidationError('Invalid status change.')


class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)
    email = serializers.EmailField()


class BidTaskOrderSerializer(serializers.Serializer):
    children = serializers.ListField(child=RecursiveField())
    url = serializers.CharField()
