from django.db import models, transaction
from django.core.exceptions import ValidationError
import uuid

class Account(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    next_bid_number = models.IntegerField(default=1)

class Customer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    bid = models.ForeignKey('Bid', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    markup_percent = models.DecimalField(max_digits=6, decimal_places=3, null=True, blank=True)
    color = models.CharField(max_length=6)

    def __str__(self):
        return '{self.name} - {self.bid.name}'.format(self=self)

    class Meta:
        verbose_name_plural = "categories"

class UnitType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    UNIT_CHOICES = (
        ('EA', 'Each'),
        ('PR', 'Pair'),
        ('FT', 'Linear Feet'),
        ('LFT', 'Linear Feet'),
        ('FT2', 'Square Feet'),
        ('FT3', 'Cubic Feet'),
        ('HR', 'Hour'),
        ('WK', 'Week'),
    )
    unit = models.CharField(max_length=3, choices=UNIT_CHOICES, default='EA')
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return self.name

class BidItem(models.Model):
    """
    The BidItem instances make up the data affecting the price of the bid.
    A BidItem has either a unit_type OR a price. The unit_type or the price
    times the quantity make up the total price. This value should be derived.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    bid = models.ForeignKey('Bid', on_delete=models.CASCADE)
    unit_type = models.ForeignKey(UnitType, on_delete=models.PROTECT, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    description = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    markup_percent = models.DecimalField(max_digits=6, decimal_places=3, null=True, blank=True)
    quantity = models.DecimalField(max_digits=7, decimal_places=2)
    parent = models.ForeignKey('BidTask', on_delete=models.CASCADE)

    def __str__(self):
        if self.unit_type is not None:
            return self.unit_type.name
        else:
            return self.description

    def clean(self):
        errors = {}
        # Don't allow categories from another bid.
        if self.category.bid.id != self.bid.id:
            errors['category'] = ValidationError(('Category from different bid'), code='invalid')

        # Don't allow parent tasks from another bid.
        if self.parent.bid.id != self.bid.id:
            errors['parent'] = ValidationError(('Parent belongs to different bid'), code='invalid')

        # Must not set both unit_type AND price
        if self.price is not None and self.unit_type is not None:
            errors['price'] = ValidationError(('Ambiguous price. Cannot set both price and unit type.'), code='invalid')

        # Must set at least unit_type OR price
        if self.price is None and self.unit_type is None:
            errors['price'] = ValidationError(('Must set either price OR unit type.'), code='invalid')

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class BidTask(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    parent = models.ForeignKey('BidTask', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    bid = models.ForeignKey('Bid', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return '{self.title} - {self.bid.name}'.format(self=self)

def get_and_increment_bid_key(account_id):
    account = Account.objects.get(id=account_id)
    new_bid_key = account.next_bid_number
    account.next_bid_number += 1
    account.save()
    return new_bid_key

class Bid(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    key = models.IntegerField()
    bid_date = models.DateField()
    created_on = models.DateTimeField(auto_now_add=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True, related_name='bids')
    tax_percent = models.DecimalField(max_digits=5, decimal_places=3, null=True, blank=True)

    def __str__(self):
        return self.name

    @transaction.atomic
    def save(self, *args, **kwargs):
        print(vars(self))
        # Get a key for the new bid or if invalid key
        if not self.pk or self.key < 0:
            self.key = get_and_increment_bid_key(self.account_id)

        super().save(*args, **kwargs)
