import { gql } from "@apollo/client";


export const GET_GROCERY_ITEM_LIST = gql`
  query getGroceryItems {
    groceryItems {
      id
      itemName
      purchased
    }
  }
`;

export const CREATE_GROCERY_ITEM = gql`
  mutation createGroceryItem ($itemName: String!) {
    createGroceryItem(itemName: $itemName) {
      item {
        id
        itemName
        purchased
      }
    }
  }
`;

export const DELETE_GROCERY_ITEM = gql`
  mutation deleteGroceryItem ($id: ID!) {
    deleteGroceryItem(id: $id) {
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