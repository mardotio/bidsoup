from django.test import TestCase
from bids.models import BidItem, Category
from django.core.exceptions import ValidationError

class ModelTest(TestCase):
    fixtures = ['ctc-fixture.json']

    def test_category_from_different_bid(self):
        # Get any item belonging to a bid
        item = BidItem.objects.first()
        # Get category from a different bid
        cat = Category.objects.exclude(bid_id=item.category.bid.id).first()

        with self.assertRaises(ValidationError):
            item.category = cat
            item.save()

    def test_category_from_same_bid(self):
        # Get two categories belonging to same bid
        cats = Category.objects.order_by('bid_id')
        cat1 = None
        cat2 = None
        for id in range(cats.last().bid.id + 1):
            if cats.filter(bid_id=id).count() >= 2:
                cat1 = cats.filter(bid_id=id)[0]
                cat2 = cats.filter(bid_id=id)[1]
                break

        # Get item with cat1
        item = BidItem.objects.filter(category=cat1)[0]

        # Save item with cat2
        item.category = cat2
        item.save()
