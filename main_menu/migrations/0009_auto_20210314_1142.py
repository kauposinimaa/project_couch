# Generated by Django 3.1.6 on 2021-03-14 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_menu', '0008_auto_20210314_1136'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activegames',
            name='data',
            field=models.JSONField(default=dict),
        ),
    ]