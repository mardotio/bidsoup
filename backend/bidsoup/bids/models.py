from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField()

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    markup_percent = models.DecimalField(max_digits=6, decimal_places=3)
    color = models.CharField(max_length=6)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "categories"

class ItemType(models.Model):
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
    bid = models.ForeignKey('Bid', on_delete=models.CASCADE, db_index=True)
    item_type = models.ForeignKey(ItemType, on_delete=models.PROTECT)
    notes = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    markup_percent = models.DecimalField(max_digits=6, decimal_places=3)
    quantity = models.DecimalField(max_digits=7, decimal_places=2)
    parent = models.ForeignKey('BidTask', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.item_type

class BidTask(models.Model):
    parent = models.ForeignKey('BidTask', on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField()

class Bid(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    bid_date = models.DateField()
    created_on = models.DateTimeField(auto_now_add=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name
