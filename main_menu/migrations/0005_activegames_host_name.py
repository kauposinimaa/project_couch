# Generated by Django 3.1.6 on 2021-03-07 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_menu', '0004_auto_20210307_0939'),
    ]

    operations = [
        migrations.AddField(
            model_name='activegames',
            name='host_name',
            field=models.CharField(default='none', max_length=255),
            preserve_default=False,
        ),
    ]
