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

    let overview = overviewData.map((row, i) => (
      <Row
        background={this.props.background}
        key={i}
        keys={this.props.keys}
        row={row['data']}
        rowStyle={row['style']}
       />
    ));

    return overview;
  }
}