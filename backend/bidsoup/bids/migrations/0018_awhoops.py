# Generated by Django 2.0.1 on 2018-09-26 05:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bids', '0017_update_unittype_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='biditem',
            name='unit_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='bids.UnitType'),
        ),
    ]
