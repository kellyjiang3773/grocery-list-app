import graphene
from graphene_django import DjangoObjectType

from .models import GroceryItemModel


# Queries
class GroceryItemType(DjangoObjectType):
    class Meta:
        model = GroceryItemModel


class Query(graphene.ObjectType):
    grocery_items = graphene.List(GroceryItemType)

    def resolve_grocery_items(self, info):
        return GroceryItemModel.objects.all()


# Mutations
class CreateGroceryItem(graphene.Mutation):
    item = graphene.Field(GroceryItemType)

    class Arguments:
        item_name = graphene.String()

    def mutate(self, info, item_name):

        item = GroceryItemModel(item_name=item_name, purchased=False)
        item.save()

        return CreateGroceryItem(item=item)


class DeleteGroceryItem(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID()

    def mutate(self, info, id):
        item = GroceryItemModel.objects.get(id=id)
        item.delete()

        return DeleteGroceryItem(ok=True)


class Mutation(graphene.ObjectType):
    create_grocery_item = CreateGroceryItem.Field()
    delete_grocery_item = DeleteGroceryItem.Field()


schema = graphene.Schema(
    query=Query,
    mutation=Mutation,
)
