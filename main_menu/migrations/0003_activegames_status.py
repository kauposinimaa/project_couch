# Generated by Django 3.1.6 on 2021-03-07 09:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_menu', '0002_activeplayers'),
    ]

    operations = [
        migrations.AddField(
            model_name='activegames',
            name='status',
            field=models.CharField(default='in_lobby', max_length=255),
            preserve_default=False,
        ),
    ]
