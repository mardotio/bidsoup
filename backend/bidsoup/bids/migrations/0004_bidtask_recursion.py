# Generated by Django 2.0.1 on 2018-02-21 03:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bids', '0003_category_unit_updates'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bidtask',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='children', to='bids.BidTask'),
        ),
        migrations.AlterField(
            model_name='bid',
            name='customer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='bids', to='bids.Customer'),
        ),
    ]