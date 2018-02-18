import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Table from './Table';

const TableContainer = styled.div`
  display: flex;
`

class JobItem extends Component {
  createCategoryTables() {
    let {jobItems} = this.props;
    let categoryTables = jobItems.map(item => {
      return (
        <Table 
          key={item.category}
          {...item}
        />
      );
    });
    return categoryTables;
  }

  render() {
    return (
      <TableContainer>
        {this.createCategoryTables()}
      </TableContainer>
    );
  }

}

const mapStateToProps = state => {
  return {
    jobItems: state.jobItems,
  };
}

export default connect(mapStateToProps)(JobItem);
