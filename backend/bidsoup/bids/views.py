from .models import Account, Bid, BidItem, BidTask, Category, Customer, Invitation, UnitType, User, MagicLink
from .users import confirm_user, delete_user
from django.db.models import Q
from rest_framework import viewsets, generics, mixins, serializers
from rest_framework.decorators import action
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import login as auth_login, get_user_model
from django.http import HttpResponse
from django.middleware.csrf import get_token
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_rules.mixins import PermissionRequiredMixin
from .serializers import AccountSerializer, BidSerializer, BidItemSerializer, \
        BidTaskSerializer, CustomerSerializer, CategorySerializer, UnitTypeSerializer, \
        UserSerializer, InvitationSerializer, InvitationUpdateSerializer, LoginSerializer, SignupSerializer, \
        BidTaskOrderSerializer
from .magic import send_magic_link_email, send_magic_link_discord
from urllib.parse import urlparse
import re


class TrapDjangoValidationErrorMixin(object):
    """Mixin providing translation from Django native Validation Errors

    In order to use the validator which exists in the model, this mixin
    provides a translation from Django's ValidationError to DRF's so a
    useful response can be returned to the client
    """

    def perform_create(self, serializer):
        try:
            super().perform_create(serializer)
        except DjangoValidationError as detail:
            raise ValidationError(detail.message_dict)

    def perform_update(self, serializer):
        try:
            super().perform_update(serializer)
        except DjangoValidationError as detail:
            raise ValidationError(detail.message_dict)


class AccountViewSet(PermissionRequiredMixin, viewsets.ModelViewSet):
    permission_required = 'bids.view_accounts'
    object_permission_required = 'bids.on_account' # TODO: Should only allow if account administrator
    serializer_class = AccountSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return self.request.user.accounts.all()


class BidViewSet(PermissionRequiredMixin, viewsets.ModelViewSet):
    permission_required = 'bids.view_bids'
    object_permission_required = 'bids.owns_bid'
    serializer_class = BidSerializer

    def list(self, request, *args, **kwargs):
        # Don't provide the subresource links in list view
        queryset = self.get_queryset()
        to_exclude = ('biditems', 'bidtasks', 'categories')
        serializer = BidSerializer(queryset, exclude_fields=to_exclude, many=True, context={'request': request})
        return Response(serializer.data)

    def get_queryset(self):
        q = Bid.objects.all()
        if 'account_slug' in self.kwargs:
            q = q.filter(account__slug=self.kwargs['account_slug'])

        accounts = self.request.user.accounts.all()
        return q.filter(account__in=accounts).order_by('-created_on')

    def perform_create(self, serializer):
        kwargs = {}
        if 'account_slug' in self.kwargs:
            slug = self.kwargs['account_slug']
            kwargs['account_id'] = Account.objects.get(slug=slug).id

        serializer.save(**kwargs)


class BidItemViewSet(
        TrapDjangoValidationErrorMixin,
        PermissionRequiredMixin,
        viewsets.ModelViewSet):
    permission_required = 'bids.view_bid_items'
    object_permission_required = 'bids.owns_bid_item'
    serializer_class = BidItemSerializer

    def get_queryset(self):
        q = BidItem.objects.all()
        if 'bid_pk' in self.kwargs:
            q = q.filter(bid_id=self.kwargs['bid_pk'])
        elif 'category_pk' in self.kwargs:
            q = q.filter(category_id=self.kwargs['category_pk'])

        accounts = self.request.user.accounts.all()
        return q.filter(bid__account__in=accounts)


class BidTaskViewSet(PermissionRequiredMixin, viewsets.ModelViewSet):
    permission_required = 'bids.view_bid_tasks'
    object_permission_required = 'bids.owns_bid_task'
    serializer_class = BidTaskSerializer

    def get_queryset(self):
        q = BidTask.objects.all().filter(Q(parent=None))
        if 'bid_pk' in self.kwargs:
            q = q.filter(bid_id=self.kwargs['bid_pk'])

        accounts = self.request.user.accounts.all()
        return q.filter(bid__account__in=accounts).order_by('sort_order')

    def get_object(self):
        """Custom function for detail view because queryset only returns
        tasks at root.
        """
        task = BidTask.objects.get(pk=self.kwargs[self.lookup_field])
        return task

    @action(methods=['post'], detail=False)
    def order(self, request, **kwargs):
        serializer = BidTaskOrderSerializer(data=request.data, many=True, context={'request': request})
        if serializer.is_valid():
            # recursively loop through children, setting order and id
            data = serializer.data
            for i in range(len(data)):
                update_order(data[i], i)

            return Response(data)
        else:
            return Response(serializer.errors, status=400)


def update_order(task, relative_order):
    url = task.get('url')
    if url[-1] == '/':
        url = url[:-1]
    task['id'] = urlparse(url).path.split('/')[-1]
    task['sort_order'] = relative_order
    for o in range(len(task.get('children'))):
        update_order(task.get('children')[o], o)




class CategoryViewSet(PermissionRequiredMixin, TrapDjangoValidationErrorMixin, viewsets.ModelViewSet):
    permission_required = 'bids.view_categories'
    object_permission_required = 'bids.owns_category'

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = {'request': self.request}
        if 'account_slug' in self.kwargs:
            kwargs['exclude_fields'] = ('from_template', 'bid',)
        else:
            kwargs['exclude_fields'] = ('used_by',)

        return CategorySerializer(*args, **kwargs)


    def get_queryset(self):
        q = Category.objects.all()

        if 'account_slug' in self.kwargs:
            # Only list bid-less Categories (i.e. those used as templates)
            q = q.filter(bid_id=None)
        if 'bid_pk' in self.kwargs:
            q = q.filter(bid_id=self.kwargs['bid_pk'])

        accounts = self.request.user.accounts.all()
        return q.filter(account__in=accounts)

    def perform_create(self, serializer):
        kwargs = {}
        if 'account_slug' in self.kwargs:
            slug = self.kwargs['account_slug']
            kwargs['account_id'] = Account.objects.get(slug=slug).id

        if 'bid_pk' in self.kwargs:
            bid_id = self.kwargs.get('bid_pk')
            kwargs['bid_id'] = bid_id
            kwargs['account_id'] = Bid.objects.get(id=bid_id).account_id

        if serializer.validated_data.get('from_template'):
            source = serializer.validated_data.get('from_template')
            if source.bid is not None:
                raise ValidationError('from_template is an instance.')

            skip_fields = ['id', 'used_by', 'from_template', 'bid']
            copy_fields = [f.name for f in Category._meta.get_fields() if f.name not in skip_fields]
            for f in copy_fields:
                val = getattr(source, f, None)
                if val:
                    kwargs[f] = val

        serializer.save(**kwargs)


class CustomerViewSet(PermissionRequiredMixin, viewsets.ModelViewSet):
    permission_required = 'bids.view_customers'
    object_permission_required = 'bids.has_customer'
    serializer_class = CustomerSerializer

    def get_queryset(self):
        q = Customer.objects.all()

        accounts = self.request.user.accounts.all()
        return q.filter(account__in=accounts)

    @action(detail=True, methods=['get'])
    def bids(self, request, pk=None):
        queryset = Bid.objects.all().filter(customer_id=pk)
        serializer = BidSerializer(queryset, many=True, context={'request':request})
        return Response(serializer.data)


class InvitationViewSet(
        mixins.ListModelMixin,
        mixins.RetrieveModelMixin,
        mixins.CreateModelMixin,
        mixins.UpdateModelMixin,
        viewsets.GenericViewSet):

    def get_serializer_class(self):
        if self.action == 'update':
            return InvitationUpdateSerializer
        else:
            return InvitationSerializer

    def get_queryset(self):
        q = Invitation.objects.all()
        accounts = self.request.user.accounts.all()
        return q.filter(Q(account__in=accounts) | Q(email=self.request.user.email))

    def perform_create(self, serializer):
        serializer.save(invited_by=self.request.user)
        # TODO: send invitation email

class UnitTypeViewSet(PermissionRequiredMixin, viewsets.ModelViewSet):
    permission_required = 'bids.view_unittypes'
    object_permission_required = 'bids.owns_unittype'
    serializer_class = UnitTypeSerializer

    def get_queryset(self):
        q = UnitType.objects.all()
        accounts = self.request.user.accounts.all()

        return q.filter(category__bid__account__in=accounts)


class UserViewSet(PermissionRequiredMixin, viewsets.ModelViewSet):
    permission_required = 'bids.view_users'
    object_permission_required = 'bids.edit_user'
    serializer_class = UserSerializer
    lookup_field = 'username'
    lookup_value_regex = r'[^/]+' # Ensure dot-delimited usernames are valid

    def get_queryset(self):
        is_user = False
        accounts = self.request.user.accounts.all()

        if 'username' in self.kwargs and self.kwargs['username'] == '@me':
            self.kwargs['username'] = self.request.user.username
            return get_user_model().objects.filter(id=self.request.user.id)

        if accounts:
            return get_user_model().objects.filter(accounts__in=accounts)
        else:
            return get_user_model().objects.filter(id=self.request.user.id)


def get_csrf_token(request):
    if request.method == 'GET':
        get_token(request)
        return HttpResponse('')

@method_decorator(csrf_protect, name='dispatch')
class SessionLoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer_class()(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            f = AuthenticationForm(data=data)
            if f.is_valid():
                auth_login(request._request, f.get_user())
                return Response({
                    'status': 'success',
                    'expiry': request.session.get_expiry_date()})
            else:
                return Response(f.errors['__all__'].get_json_data(True), 401)

        return Response({'status': 'invalid_body'}, status=400)


@method_decorator(csrf_protect, name='dispatch')
class SignupViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    permission_classes = (AllowAny,)
    serializer_class = SignupSerializer

    @staticmethod
    def _is_new_user(user):
        return User.objects.filter(Q(username=user.username) | Q(email=user.email)).count() == 0

    def perform_create(self, serializer):
        data = serializer.validated_data
        data['is_active'] = False
        u = User(**data)
        u.set_password(data.get('password'))

        if self._is_new_user(u):
            u.save()
            link = MagicLink.objects.create(user=u)
            send_magic_link_discord(link, self.request)
        else:
            raise serializers.ValidationError([{
                'message': 'Username or email already exists.',
                'code': 'duplicate_account'
            }])

def confirm_from_magic(request, link):
    # Since discord attempts to unfurl links, return early if their bot made the request
    if re.search('Discordbot', request.META.get('HTTP_USER_AGENT')):
        return HttpResponse('Go away')

    num_params = len(request.GET)

    if num_params == 0:
        confirm_user(link)
        return redirect('/login/') # TODO: How do we let the backend redirect for the frontend?
    elif num_params == 1 and 'delete' in request.GET:
        delete_user(link)
        return HttpResponse('User and link deleted')
    elif num_params == 1 and 'send' in request.GET:
        l = MagicLink.objects.filter(link=link).get()
        send_magic_link_email(l, request)
        return HttpResponse('Email sent')
    else:
        return HttpResponse(f'Invalid query parameter{"s" if num_params > 1 else ""}.', status=400)
