# Generated by Django 2.0.1 on 2018-10-05 02:21

from django.db import migrations, models
import django.db.models.deletion
import uuid


def log(message):
    def fake_op(apps, schema_editor):
        print(message)
    return fake_op


class Migration(migrations.Migration):

    dependencies = [
        ('bids', '0024_break_categories'),
    ]

    operations = [
        migrations.RunPython(log('Remove all FKs'), reverse_code=migrations.RunPython.noop),
        # Remove all FKs to customer
        migrations.RemoveField(
            model_name='biditem',
            name='category',
        ),
        migrations.RunPython(log('FKs removed'), reverse_code=migrations.RunPython.noop),
        # Remove customer id field
        migrations.RemoveField(
            model_name='category',
            name='id',
        ),
        # Make uuid field the PK
        migrations.AlterField(
            model_name='category',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False, unique=True),
        ),
        # Rename uuid to PK
        migrations.RenameField(
            model_name='category',
            old_name='uuid',
            new_name='id'
        ),
        # Restore FKs to category
        migrations.AlterField(
            model_name='biditem',
            name='category_uuid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bids.Category'),
        ),
        # Rename temp FK to original
        migrations.RenameField(
            model_name='biditem',
            old_name='category_uuid',
            new_name='category'
        ),
    ]