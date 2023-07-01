import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';


const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql/',
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

client.query({ query: QUERY_GROCERY_ITEMS }).then((result) => console.log(result));

const ItemList = () => {
  const { loading, error, data } = useQuery(
    QUERY_GROCERY_ITEMS,
    {
      pollInterval: 2000
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return data.groceryItems.map(( {id, itemName, purchased }) => (
    <div key={id}>
      <h3>{itemName}</h3>
      {purchased ? <p>(purchased)</p> : <p>(not purchased yet)</p>}
    </div>
  ))
}

const App = () => (
  <ApolloProvider client={client}>
    <div style={{
      backgroundColor: '#00000008',
      display: 'flex',
      justifyContent:'center',
      alignItems:'center',
      height: '100vh',
      flexDirection: 'column',
    }}>
      <ItemList />
    </div>
  </ApolloProvider>
);

export default App;
