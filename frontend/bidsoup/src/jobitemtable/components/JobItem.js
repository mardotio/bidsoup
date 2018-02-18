import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from './Table';

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
      <div>
        {this.createCategoryTables()}
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    jobItems: state.jobItems,
  };
}

export default connect(mapStateToProps)(JobItem);
