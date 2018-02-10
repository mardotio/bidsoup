import React, { Component } from 'react';
import Row from './Row';

export default class Overview extends Component {
  render() {
    let {category, total} = this.props.value;
    let overviewData = [
      {
        style: 'header',
        data: {
          description: category
        }
      },{
        data: {
          description: 'total',
          total: total
        }
      }
    ];

    let overview = overviewData.map(row => (
      <Row
        background={this.props.background}
        key={overviewData.indexOf(row)}
        keys={this.props.keys}
        row={row['data']}
        rowStyle={row['style']}
       />
    ));

    return overview;
  }
}