import React from 'react';
import { useQuery } from '@apollo/client';
import '../styles/App.css';
import { ItemNameInput } from './ItemRow';
import { ItemList } from './ItemList';
import { GET_GROCERY_LISTS } from '../lib/GqlStrings';


const App = () => {
  const { loading, error, data } = useQuery(GET_GROCERY_LISTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data.groceryLists.length === 0) return <p>No grocery lists yet - make one!</p>

  let list = data.groceryLists[0];

  return (
    <div style={{
      display: 'flex',
      justifyContent:'left',
      alignItems:'left',
      flexDirection: 'column',
      margin: '20px'
    }}>
      <h3>Grocery List: {list.listName}</h3>
      <ItemNameInput listId={list.id} />
      <ItemList listId={list.id} />
    </div>
  );
};

export default App;
