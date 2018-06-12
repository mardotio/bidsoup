import React, { Component } from 'react';
import styled from 'styled-components';
import Table from './Table';
import CategoryCard from './CategoryCard'

const ItemWrapper = styled.div`
  margin-top: 1em;
`

const JobItemHeader = styled.div`
  margin-left: 1em;
`

const Container = styled.div`
  display: flex;
  margin-left: 1em;
  flex-wrap: wrap;
`

const TableContainer = styled.div`
  width: 100%;
`

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: this.props.tableData[0].category,
    };
    this.selectCategory = this.selectCategory.bind(this);
  }

  selectCategory(cat) {
    if (this.state.selectedCategory !== cat) {
      this.setState({
        selectedCategory: cat,
      });
    }
  }

  createCategoryTables() {
    let {tableData} = this.props;
    let selectedCategory = tableData.find(item => (
      item.category === this.state.selectedCategory
    )) || tableData[0];
    return (
      <Table
        key={selectedCategory.category}
        {...selectedCategory}
      />
    );
  }

  createCategoryCards() {
    let {tableData} = this.props;
    let categoryCards = tableData.map(item => {
      let total = item.rows.reduce((currentTotal, next) => {
        return currentTotal += next.total;
      }, 0);
      return (
        <CategoryCard
          key={item.category}
          category={item.category}
          selected={this.state.selectedCategory === item.category}
          total={total}
          background={item.color}
          onClick={this.selectCategory}
        />
      );
    });
    return categoryCards;
  }

  render() {
    return (
      <ItemWrapper>
        <JobItemHeader>
          {this.props.selectedTask.title}
        </JobItemHeader>
        <Container>
          {this.createCategoryCards()}
        </Container>
        <TableContainer>
          {this.createCategoryTables()}
        </TableContainer>
      </ItemWrapper>
    );
  }
}
