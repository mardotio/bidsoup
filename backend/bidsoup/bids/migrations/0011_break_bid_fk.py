# Generated by Django 2.0.1 on 2018-09-26 04:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bids', '0010_bid_uuid_fk'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='biditem',
            name='bid',
        ),
        migrations.RemoveField(
            model_name='bidtask',
            name='bid',
        ),
        migrations.RemoveField(
            model_name='category',
            name='bid',
        ),
    ]