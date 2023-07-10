import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete'
import { Checkbox } from '@mui/material';
import { useSnackbar } from 'notistack';
import './App.css';


const QUERY_GROCERY_ITEMS = gql`
  query getGroceryItems {
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
        id
        purchased
      }
    }
  }
`;

const EDIT_GROCERY_ITEM = gql`
  mutation editGroceryItem($id: ID, $itemName: String) {
    editGroceryItem(id: $id, itemName: $itemName) {
      item {
        id
        itemName
      }
    }
  }
`;

const ItemNameInput = ({isEdit = false, id = null, itemName = '', callback = null}) => {
  let inputNode;
  const [createGroceryItem] = useMutation(CREATE_GROCERY_ITEM, {
    refetchQueries: [
      QUERY_GROCERY_ITEMS,
      'GetGroceryItems'
    ]
  });
  const [editGroceryItem] = useMutation(EDIT_GROCERY_ITEM);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();

          if (inputNode.value === '') {
            enqueueSnackbar('Item name must be non-empty');
          } else if (isEdit) {
            editGroceryItem({ variables: {
              id: id,
              itemName: inputNode.value,
            }}).then(res => {
              callback(false);
            }).catch(err => enqueueSnackbar(err.message));
          } else {
            createGroceryItem({ variables: {
              itemName: inputNode.value,
            }}).catch(err => enqueueSnackbar(err.message));
            inputNode.value = '';
          }
        }}
        style = {{ marginTop: '2em', marginBottom: '2em' }}
      >
      {!isEdit && <label>New item: </label>}
      <input
        defaultValue={itemName}
        ref={element => {
          inputNode = element;
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
      <ItemNameInput isEdit id={id} itemName={itemName} callback={setIsEditing} />
    ) : (
      <div
        style={{
          display: 'flex',
          alignItems:'left',
          flexDirection: 'row',
        }}
      >
        <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <p className={(purchased ? 'purchased' : 'not-purchased') + ' item-label'}>{itemName}</p>
        </div>
      </div>
    ));
}

const ItemList = () => {
  const [deleteGroceryItem] = useMutation(DELETE_GROCERY_ITEM, {
    refetchQueries: [
      QUERY_GROCERY_ITEMS,
      'GetGroceryItems'
    ]
  });
  const [togglePurchased] = useMutation(TOGGLE_PURCHASED);
  const { loading, error, data } = useQuery(
    QUERY_GROCERY_ITEMS,
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

const App = () => (
  <div style={{
    display: 'flex',
    justifyContent:'left',
    alignItems:'left',
    flexDirection: 'column',
    margin: '20px'
  }}>
    <h3>Grocery List</h3>
    <ItemNameInput />
    <ItemList />
  </div>
);

export default App;
