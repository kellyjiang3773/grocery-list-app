import React from 'react';
import '../styles/App.css';
import { ItemNameInput } from './ItemRow';
import { ItemList } from './ItemList';


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
