# Generated by Django 4.2.2 on 2023-07-13 05:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('grocerylistapp', '0004_alter_groceryitemmodel_list_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='groceryitemmodel',
            old_name='list_id',
            new_name='list',
        ),
    ]