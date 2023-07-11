import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GET_GROCERY_ITEM_LIST, DELETE_GROCERY_ITEM, TOGGLE_PURCHASED } from '../lib/GqlStrings';
import { ItemDisplay } from './ItemRow';


export const ItemList = () => {
    const [deleteGroceryItem] = useMutation(DELETE_GROCERY_ITEM, {
      refetchQueries: [
        GET_GROCERY_ITEM_LIST,
        'GetGroceryItems'
      ]
    });
    const [togglePurchased] = useMutation(TOGGLE_PURCHASED);
    const { loading, error, data } = useQuery(
      GET_GROCERY_ITEM_LIST,
      // { pollInterval: 2000 }
    );
    
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    if (data.groceryItems.length === 0) return <p>Nothing to buy!</p>
  
    return data.groceryItems.map(( {id, itemName, purchased }) => {
      return (
        <div 
          className='item-row'
          key={id} 
          style={{
            display: 'flex',
            justifyContent:'centre',
            alignItems:'left',
            flexDirection: 'row',
            height: '50px',
            padding: '5px',
        }}>
          <IconButton
            aria-label="delete"
            onClick={() => {
              deleteGroceryItem({ variables: {id: id} });
            }}
          >
            <DeleteIcon />
          </IconButton>
          <Checkbox 
            checked={purchased}
            onClick={() => {
              togglePurchased({ variables: {id: id} })
            }}
          />
          <ItemDisplay id={id} itemName={itemName} purchased={purchased} />
        </div>
        )}
    );
  }