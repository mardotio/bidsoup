import React, { Component } from 'react';
import styled from 'styled-components';
import Table from './Table';
import CategoryCard from './CategoryCard';
import HorizontalRule from '../../components/HorizontalRule';

const ItemWrapper = styled.div`
  margin-top: 1em;
  width: 95%;
`

const JobItemHeader = styled.div`
  font-size: 1.5em;
`

const TaskDescription = styled.div`
`

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1em 0;
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
    ));
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
      let total = item.rows.reduce((currentTotal, next) => (
        currentTotal + next.total
      ), 0);
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
        <HorizontalRule />
        <TaskDescription>
          {this.props.selectedTask.description}
        </TaskDescription>
        <CardContainer>
          {this.createCategoryCards()}
        </CardContainer>
        <TableContainer>
          {this.createCategoryTables()}
        </TableContainer>
      </ItemWrapper>
    );
  }
}
