# Generated by Django 2.0.1 on 2019-12-04 02:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

# Move the account into the account set.
def migrate_accounts(apps, schema_editor):
    User = apps.get_model('bids', 'User')
    AccountUser = apps.get_model('bids', 'AccountUser')

    for u in User.objects.all():
        if u.account:
            AccountUser.objects.create(user=u, account=u.account)


class Migration(migrations.Migration):

    dependencies = [
        ('bids', '0038_invitations'),
    ]

    operations = [
        migrations.CreateModel(
            name='AccountUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('access_level', models.CharField(choices=[('OWNER', 'Owner'), ('MANAGER', 'Manager'), ('USER', 'User')], default='USER', max_length=20)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bids.Account')),
            ],
        ),
        migrations.AddField(
            model_name='accountuser',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='user',
            name='accounts',
            field=models.ManyToManyField(related_name='users', through='bids.AccountUser', to='bids.Account'),
        ),
        migrations.RunPython(
            code=migrate_accounts,
        ),
        migrations.RemoveField(
            model_name='user',
            name='account',
        ),
    ]
