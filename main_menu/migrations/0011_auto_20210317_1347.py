# Generated by Django 3.1.6 on 2021-03-17 13:47

from django.db import migrations, models
import main_menu.models


class Migration(migrations.Migration):

    dependencies = [
        ('main_menu', '0010_auto_20210314_1222'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activegames',
            name='room_code',
            field=models.CharField(default=main_menu.models.generate_room_code, max_length=5, unique=True),
        ),
        migrations.DeleteModel(
            name='ActivePlayers',
        ),
    ]
