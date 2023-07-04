import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';


const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache()
});

const QUERY_GROCERY_ITEMS = gql`
  query {
    groceryItems {
      id
      itemName
      purchased
    }
  }
`;

const CREATE_GROCERY_ITEM = gql`
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

const DELETE_GROCERY_ITEM = gql`
  mutation deleteGroceryItem ($id: ID!) {
    deleteGroceryItem(id: $id) {
      ok
    }
  }
`;

const TOGGLE_PURCHASED = gql`
  mutation toggleGroceryItemPurchased($id: ID) {
    toggleGroceryItemPurchased(id: $id) {
      item {
        purchased
      }
    }
  }
`;

const EDIT_GROCERY_ITEM = gql`
  mutation editGroceryItem($id: ID, $itemName: String) {
    editGroceryItem(id: $id, itemName: $itemName) {
      item {
        itemName
      }
    }
  }
`;

const ItemNameInput = ({isEdit = false, id = null, itemName = null}) => {
  let value = itemName;
  const [createGroceryItem] = useMutation(CREATE_GROCERY_ITEM);
  const [editGroceryItem] = useMutation(EDIT_GROCERY_ITEM);
  return (
    <div>
      <form
        onSubmit={e => {
          if (isEdit) {
            editGroceryItem({ variables: {
              id: id,
              itemName: value.value,
            }})
          } else {
            createGroceryItem({ variables: {
              itemName: value.value,
            } });
          }
          value.value = '';
        }}
        style = {{ marginTop: '2em', marginBottom: '2em' }}
      >
      {!isEdit && <label>New item: </label>}
      <input
        defaultValue={value}
        ref={node => {
          value = node;
        }}
        style={{ marginRight: '1em' }}
      />
      <button type="submit" style={{ cursor: 'pointer' }}>{isEdit ? 'Done' : 'Add'}</button>
    </form>
   </div>
  );
}

const ItemDisplay = ({id, itemName, purchased}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (isEditing ? 
    (
      <ItemNameInput isEdit id={id} itemName={itemName} />
    ) : (
      <div>
        <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
        <p>{itemName} - {purchased ? "(purchased)" : "(not purchased yet)"}</p>
      </div>
    ));
}

const ItemList = () => {
  const [deleteGroceryItem] = useMutation(DELETE_GROCERY_ITEM);
  const [togglePurchased] = useMutation(TOGGLE_PURCHASED);
  const { loading, error, data } = useQuery(
    QUERY_GROCERY_ITEMS,
    // { pollInterval: 2000 }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return data.groceryItems.map(( {id, itemName, purchased }) => {
    return (
      <div 
        key={id} 
        style={{
          display: 'flex',
          justifyContent:'left',
          alignItems:'left',
          flexDirection: 'row',
      }}>
        <button onClick={() => {
          deleteGroceryItem({ variables: {id: id} });
          window.location.reload();
        }}>X</button>
        <button onClick={() => {
          togglePurchased({ variables: {id: id} });
          window.location.reload();
        }}>V</button>
        <ItemDisplay id={id} itemName={itemName} purchased={purchased} />
      </div>
      )}
  );
}

const App = () => (
  <ApolloProvider client={client}>
    <div style={{
      backgroundColor: '#00000008',
      display: 'flex',
      justifyContent:'left',
      alignItems:'left',
      height: '100vh',
      flexDirection: 'column',
    }}>
      <ItemNameInput />
      <ItemList />
    </div>
  </ApolloProvider>
);

export default App;
