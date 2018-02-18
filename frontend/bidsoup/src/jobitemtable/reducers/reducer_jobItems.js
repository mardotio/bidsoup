const JobItemsReducer = () => {
  return [{
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
  },{
    category: 'materials',
    color: '#ba2773',
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
  },{
    category: 'miscellaneous',
    color: '#397bc6',
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
  }];
};

export default JobItemsReducer;
