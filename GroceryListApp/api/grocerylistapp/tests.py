import json
from graphene_django.utils.testing import GraphQLTestCase
from .models import GroceryItemModel


QUERY = """
    query {
        groceryItems {
            id
            itemName
            purchased
        }
    }
"""


class GroceryItemQueryTest(GraphQLTestCase):

    def test_query_grocery_items(self):
        # Setup
        name1 = "test celery"
        name2 = "test cucumber"
        GroceryItemModel.objects.create(item_name=name1, purchased=False)
        GroceryItemModel.objects.create(item_name=name2, purchased=False)

        # Execute
        response = self.query(QUERY)
        
        # Assert
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        grocery_list = content["data"]["groceryItems"]
        self.assertEqual(len(grocery_list), 2)
        self.assertEqual(grocery_list[0]["itemName"], name1)
        self.assertEqual(grocery_list[0]["purchased"], False)
        self.assertEqual(grocery_list[1]["itemName"], name2)
        self.assertEqual(grocery_list[1]["purchased"], False)


    def test_query_grocery_items_with_empty_list(self):
        # Execute
        response = self.query(QUERY)
        
        # Assert
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        self.assertEqual(len(content.get("data").get("groceryItems")), 0)


    def test_create_grocery_item_should_not_be_purchased(self):
        # Setup
        item_name = 'yukon gold potato'

        # Execute
        response = self.query(
            '''
            mutation createGroceryItem($itemName: String) {
                createGroceryItem(itemName: $itemName) {
                    item {
                        id
                        itemName
                        purchased
                    }
                }
            }
            ''',
            operation_name='createGroceryItem',
            variables={'itemName': item_name}
        )

        # Assert
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        id = content["data"]["createGroceryItem"]["item"]["id"]
        item = GroceryItemModel.objects.get(id=id)
        self.assertEqual(item.item_name, item_name)
        self.assertEqual(item.purchased, False)


    def test_delete_grocery_item(self):
        # Setup
        item_name = 'russet potato'
        item = GroceryItemModel.objects.create(item_name=item_name, purchased=False)
        id = item.id

        # Execute
        response = self.query(
            '''
            mutation deleteGroceryItem($id: ID) {
                deleteGroceryItem(id: $id) {
                    ok
                }
            }
            ''',
            operation_name='deleteGroceryItem',
            variables={'id': id}
        )

        # Assert
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["data"]["deleteGroceryItem"]["ok"], True)
        matching_items = GroceryItemModel.objects.filter(id=id)
        self.assertEqual(matching_items.count(), 0)
