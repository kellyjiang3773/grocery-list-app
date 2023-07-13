import { gql } from "@apollo/client";


export const GET_GROCERY_ITEMS = gql`
  query getGroceryItems ($listId: ID!) {
    groceryItems(listId: $listId) {
      id
      itemName
      purchased
    }
  }
`;

export const GET_GROCERY_LISTS = gql`
  query getGroceryLists {
    groceryLists {
      id
      listName
      owner
    }
  }
`;

export const CREATE_GROCERY_ITEM = gql`
  mutation createGroceryItem ($itemName: String!, $listId: ID!) {
    createGroceryItem(itemName: $itemName, listId: $listId) {
      item {
        id
        itemName
        purchased
      }
    }
  }
`;

export const DELETE_GROCERY_ITEM = gql`
  mutation deleteGroceryItem ($itemId: ID!, $listId: ID!) {
    deleteGroceryItem(itemId: $itemId, listId: $listId) {
      ok
    }
  }
`;

export const TOGGLE_PURCHASED = gql`
  mutation toggleGroceryItemPurchased($id: ID) {
    toggleGroceryItemPurchased(id: $id) {
      item {
        id
        purchased
      }
    }
  }
`;

export const EDIT_GROCERY_ITEM = gql`
  mutation editGroceryItem($id: ID, $itemName: String) {
    editGroceryItem(id: $id, itemName: $itemName) {
      item {
        id
        itemName
      }
    }
  }
`;