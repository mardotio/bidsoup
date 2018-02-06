import React, { Component } from 'react';
import Row from './Row';

export default class Overview extends Component {
  render() {
    let overview = this.props.value.map(row => (
      <Row
        background={this.props.background}
        key={this.props.value.indexOf(row)}
        value={row}
        overview
       />
    ));

    return overview;
  }
}