from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    bid = models.ForeignKey('Bid', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    markup_percent = models.DecimalField(max_digits=6, decimal_places=3, null=True, blank=True)
    color = models.CharField(max_length=6)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "categories"

class UnitType(models.Model):
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
    A BidItem has either a unit_type OR a price. The unit_type/quantity
    can make up the items price, or the price can be explicit.
    """
    bid = models.ForeignKey('Bid', on_delete=models.CASCADE, db_index=True)
    unit_type = models.ForeignKey(UnitType, on_delete=models.PROTECT, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    description = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    markup_percent = models.DecimalField(max_digits=6, decimal_places=3, null=True, blank=True)
    quantity = models.DecimalField(max_digits=7, decimal_places=2)
    parent = models.ForeignKey('BidTask', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.item_type.name

class BidTask(models.Model):
    parent = models.ForeignKey('BidTask', on_delete=models.SET_NULL, null=True, blank=True)
    bid = models.ForeignKey('Bid', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.title

class Bid(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    bid_date = models.DateField()
    created_on = models.DateTimeField(auto_now_add=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)
#    tax_percent = models.DecimalField(max_digits=5, decimal_places=3)

    def __str__(self):
        return self.name
