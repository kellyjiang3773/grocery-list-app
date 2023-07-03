from django.db import models


# Create your models here.
class GroceryItemModel(models.Model):
    item_name = models.CharField(max_length=100)
    purchased = models.BooleanField()
