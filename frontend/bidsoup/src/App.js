import React, { Component } from 'react';
import Table from './jobitem/Table';

const data = {
  category: 'labor',
  color: '#05b57a',
  headers: [
    'description',
    'quantity',
    'price',
    'total'
  ],
  data: [{
    description: 'This is a long description for an item',
    quantity: 1,
    price: 999.99
  },{
    description: 'Some description',
    quantity: 13,
    price: 54
  },{
    description: 'Some description',
    quantity: 8,
    price: 514
  },{
    description: 'Some description',
    quantity: 4,
    price: 254
  },{
    description: 'Some description',
    quantity: 1,
    price: 2354
  }]
}

class App extends Component {
  render() {
    return (
      <Table value={data}/>
    );
  }
}

export default App;
