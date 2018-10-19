from .models import Account, Bid, BidItem, BidTask, Category, Customer, UnitType
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .serializers import AccountSerializer, BidSerializer, BidItemSerializer, \
                         BidTaskSerializer, CustomerSerializer, CategorySerializer, \
                         UnitTypeSerializer


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
            super().perform_create(serializer)
        except DjangoValidationError as detail:
            raise ValidationError(detail.message_dict)


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    lookup_field = 'slug'


class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all().order_by('-created_on')
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

        return q


class BidItemViewSet(TrapDjangoValidationErrorMixin, viewsets.ModelViewSet):
    serializer_class = BidItemSerializer

    def get_queryset(self):
        q = BidItem.objects.all()
        if 'bid_pk' in self.kwargs:
            q = q.filter(bid_id=self.kwargs['bid_pk'])
        elif 'category_pk' in self.kwargs:
            q = q.filter(category_id=self.kwargs['category_pk'])

        return q


class BidTaskViewSet(viewsets.ModelViewSet):
    serializer_class = BidTaskSerializer

    def get_queryset(self):
        q = BidTask.objects.all().filter(Q(parent=None))
        if 'bid_pk' in self.kwargs:
            q = q.filter(bid_id=self.kwargs['bid_pk'])

        return q

    def get_object(self):
        """Custom function for detail view because queryset only returns
        tasks at root.
        """
        print(self.kwargs[self.lookup_field])
        task = BidTask.objects.get(pk=self.kwargs[self.lookup_field])
        return task


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        q = Category.objects.all()
        if 'bid_pk' in self.kwargs:
            q = q.filter(bid_id=self.kwargs['bid_pk'])

        return q


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    @detail_route(methods=['get'])
    def bids(self, request, pk=None):
        queryset = Bid.objects.all().filter(customer_id=pk)
        serializer = BidSerializer(queryset, many=True, context={'request':request})
        return Response(serializer.data)


class UnitTypeViewSet(viewsets.ModelViewSet):
    queryset = UnitType.objects.all()
    serializer_class = UnitTypeSerializer
