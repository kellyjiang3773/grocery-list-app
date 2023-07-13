# Generated by Django 4.2.2 on 2023-07-12 05:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grocerylistapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroceryListModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('list_name', models.CharField(max_length=100)),
                ('owner', models.CharField(max_length=100)),
                ('items', models.JSONField()),
            ],
        ),
    ]