from django.db import models


# Create your models here.
class GroceryListModel(models.Model):
    list_name = models.CharField(max_length=100)
    owner = models.CharField(max_length=100)
    items = models.JSONField()


class GroceryItemModel(models.Model):
    item_name = models.CharField(max_length=100)
    purchased = models.BooleanField()
    list = models.ForeignKey(GroceryListModel, on_delete=models.CASCADE)

