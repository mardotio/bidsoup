# Generated by Django 2.0.1 on 2018-09-26 04:26

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('bids', '0011_break_bid_fk'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bid',
            name='id',
        ),
        migrations.AlterField(
            model_name='bid',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False, unique=True),
        ),
    ]