import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GET_GROCERY_ITEMS, CREATE_GROCERY_ITEM, EDIT_GROCERY_ITEM } from '../lib/GqlStrings';
import { useSnackbar } from 'notistack';


export const ItemNameInput = ({isEdit = false, id = null, itemName = '', callback = null, listId = null}) => {
    let inputNode;
    const [createGroceryItem] = useMutation(CREATE_GROCERY_ITEM, {
      refetchQueries: [
        GET_GROCERY_ITEMS,
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
                listId: listId,
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


export const ItemDisplay = ({id, itemName, purchased}) => {
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