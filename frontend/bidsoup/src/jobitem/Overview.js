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
          final: total
        }
      }
    ];

    let overview = overviewData.map(row => (
      <Row
        background={this.props.background}
        key={overviewData.indexOf(row)}
        value={row['data']}
        rowStyle={row['style']}
       />
    ));

    return overview;
  }
}