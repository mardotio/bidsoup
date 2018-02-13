import React, { Component } from 'react';
import Table from './jobitemtable/components/Table';

const data = {
  category: 'labor',
  color: '#05b57a',
  columns: [{
      name: 'description',
      style: 'text'
    },{
      name: 'quantity',
      style: 'number'
    },{
      name: 'price',
      style: 'currency'
    },{
      name: 'total',
      style: 'currency'
    }
  ],
  rows: [{
    description: 'This is a long description for an item',
    quantity: 10,
    price: 9999.99
  },{
    description: 'Some description',
    quantity: 13,
    price: 5400
  },{
    description: 'Some description',
    quantity: 8,
    price: 5141
  },{
    description: 'Some description',
    quantity: 4,
    price: 2540
  },{
    description: 'Some description',
    quantity: 16,
    price: 2354
  }]
}

class App extends Component {
  render() {
    return (
      <Table {...data} />
    );
  }
}

export default App;
