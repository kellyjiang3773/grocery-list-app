import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';


const client = new ApolloClient({
  uri: 'http://0.0.0.0:8000/graphql',
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

client.query({ query: QUERY_GROCERY_ITEMS }).then((result) => console.log(result));

const CreateItemInput = () => {
  let itemName;
  const [createGroceryItem] = useMutation(CREATE_GROCERY_ITEM);
  return (
    <div>
      <form
        onSubmit={e => {
          createGroceryItem({ variables: {
            itemName: itemName.value,
        } });
        itemName.value = '';
        window.location.reload();
      }}
      style = {{ marginTop: '2em', marginBottom: '2em' }}
     >
     <label>New item: </label>
     <input
       ref={node => {
        itemName = node;
       }}
       style={{ marginRight: '1em' }}
     />
     <button type="submit" style={{ cursor: 'pointer' }}>Add</button>
    </form>
   </div>
  );
}

const ItemList = () => {
  const [deleteGroceryItem] = useMutation(DELETE_GROCERY_ITEM);
  const { loading, error, data } = useQuery(
    QUERY_GROCERY_ITEMS,
    // { pollInterval: 2000 }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return data.groceryItems.map(( {id, itemName, purchased }) => (
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
      <p>{itemName} - {purchased ? "(purchased)" : "(not purchased yet)"}</p>
    </div>
  ))
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
      <CreateItemInput />
      <ItemList />
    </div>
  </ApolloProvider>
);

export default App;
