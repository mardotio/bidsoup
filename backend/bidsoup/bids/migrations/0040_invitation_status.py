# Generated by Django 2.0.1 on 2019-12-07 18:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bids', '0039_multiple_accounts'),
    ]

    operations = [
        migrations.AddField(
            model_name='invitation',
            name='status',
            field=models.CharField(choices=[('CREATED', 'Created'), ('SENT', 'Sent'), ('ACCEPTED', 'Accepted'), ('DECLINED', 'Declined')], default='CREATED', max_length=12),
        ),
    ]