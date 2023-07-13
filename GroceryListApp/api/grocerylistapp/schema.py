import json
from django.db.models import Case, When
import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from .models import GroceryItemModel, GroceryListModel


# Helpers
def has_item_name_dup(item_name):
    matches = GroceryItemModel.objects.filter(item_name=item_name).count()
    return matches > 0


# Returns new list with added item (JSON)
def add_item_to_list(json_items, item_id):
    py_items = json.loads(json_items)
    new_py_items = py_items + [item_id]
    new_json_items = json.dumps(new_py_items)
    return new_json_items


# Returns new list without removed item (JSON)
def remove_item_from_list(json_items, item_id):
    py_items = json.loads(json_items)
    try:
        py_items.remove(int(item_id))
    except:
        print(f"Warning: Tried to remove item (id {item_id}) from a list it wasn't in - continuing")
    new_json_items = json.dumps(py_items)
    return new_json_items


class GroceryItemType(DjangoObjectType):
    class Meta:
        model = GroceryItemModel


class GroceryListType(DjangoObjectType):
    class Meta:
        model = GroceryListModel


# Queries
class Query(graphene.ObjectType):
    grocery_items = graphene.List(GroceryItemType, list_id=graphene.ID(required=True))
    grocery_lists = graphene.List(GroceryListType)

    def resolve_grocery_items(self, info, list_id):
        grocery_list = GroceryListModel.objects.get(id=list_id)
        item_ids = json.loads(grocery_list.items)
        preserved_order = Case(*[When(id=id, then=pos) for pos, id in enumerate(item_ids)])
        return GroceryItemModel.objects.filter(id__in=item_ids).order_by(preserved_order)

    
    def resolve_grocery_lists(self, info):
        return GroceryListModel.objects.all()


# Mutations
class CreateGroceryItem(graphene.Mutation):
    item = graphene.Field(GroceryItemType)

    class Arguments:
        item_name = graphene.String()
        list_id = graphene.ID()

    def mutate(self, info, item_name, list_id):

        if len(item_name) == 0:
            raise GraphQLError('Item name must be non-empty')
        elif has_item_name_dup(item_name) == True:
            raise GraphQLError('Item already exists in the list')
        else:
            list = GroceryListModel.objects.get(id=list_id)

            item = GroceryItemModel(item_name=item_name, purchased=False, list=list)
            item.save()

            # Add it to its list
            new_item_list = add_item_to_list(list.items, item.id)
            list.items = new_item_list
            list.save()

        return CreateGroceryItem(item=item)


class DeleteGroceryItem(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        item_id = graphene.ID()
        list_id = graphene.ID()

    def mutate(self, info, item_id, list_id):
        # Remove item from its list
        list = GroceryListModel.objects.get(id=list_id)
        new_item_list = remove_item_from_list(list.items, item_id)
        list.items = new_item_list
        list.save()

        item = GroceryItemModel.objects.get(id=item_id)
        item.delete()

        return DeleteGroceryItem(ok=True)
    

class ToggleGroceryItemPurchased(graphene.Mutation):
    item = graphene.Field(GroceryItemType)

    class Arguments:
        id = graphene.ID()

    def mutate(self, info, id):
        item = GroceryItemModel.objects.get(id=id)
        item.purchased = False if item.purchased == True else True
        item.save()

        return ToggleGroceryItemPurchased(item=item)
    

class EditGroceryItem(graphene.Mutation):
    item = graphene.Field(GroceryItemType)

    class Arguments:
        id = graphene.ID()
        item_name = graphene.String()

    def mutate(self, info, id, item_name):

        item = GroceryItemModel.objects.get(id=id)
        old_item_name = item.item_name

        if old_item_name == item_name:
            raise GraphQLError('Item name did not change')
        elif has_item_name_dup(item_name) == True:
            raise GraphQLError('Item already exists in the list')
        else:
            item.item_name = item_name
            item.save()

        return EditGroceryItem(item=item)


class CreateGroceryList(graphene.Mutation):
    list = graphene.Field(GroceryListType)

    class Arguments:
        list_name = graphene.String()

    def mutate(self, info, list_name):

        if len(list_name) == 0:
            raise GraphQLError('Item name must be non-empty')
        else:
            json_list = json.dumps([])
            list = GroceryListModel(list_name=list_name, owner='me', items=json_list)
            list.save()

        return CreateGroceryList(list=list)


class Mutation(graphene.ObjectType):
    create_grocery_item = CreateGroceryItem.Field()
    delete_grocery_item = DeleteGroceryItem.Field()
    toggle_grocery_item_purchased = ToggleGroceryItemPurchased.Field()
    edit_grocery_item = EditGroceryItem.Field()
    create_grocery_list = CreateGroceryList.Field()


schema = graphene.Schema(
    query=Query,
    mutation=Mutation,
)
