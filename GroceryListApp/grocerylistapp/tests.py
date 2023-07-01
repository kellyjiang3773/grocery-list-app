from graphene_django.utils.testing import GraphQLTestCase
import json
import pytest
from .models import GroceryItemModel
from .schema import schema

# from graphene_django.utils.testing import graphql_query
#
# @pytest.fixture
# def client_query(client):
#     def func(*args, **kwargs):
#         return graphql_query(*args, **kwargs, client=client)
#
#     return func


class GroceryItemQueryTest(GraphQLTestCase):
    # GRAPHQL_SCHEMA = schema
    # GRAPHQL_URL = '/graphql'
    # GraphQLTestCase.GRAPHQL_URL = 'http://localhost/graphql'

    def test_create_grocery_item_should_not_be_purchased(self):
        # Setup
        item_name = 'potato'

        # Execute
        response = self.query(
            '''
            mutation createGroceryItem($item_name: string) {
                createGroceryItem(item_name: $item_name) {
                    groceryItem {
                        id
                        item_name
                        purchased
                    }
                }
            }
            ''',
            operation_name='createGroceryItem',
            input_data={'item_name': item_name}
        )

        # Assert
        print('oooooo')
        print(response)
        print('oooooo')
        self.assertResponseNoErrors(response)
        # item = GroceryItemModel.objects.get(id=id)
        # self.assertEqual(item.item_name, item_name)
        # self.assertEqual(item.purchased, False)
