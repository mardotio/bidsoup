import React, { Component } from 'react';
import styled from 'styled-components';
import Table from './Table';
import CategoryCard from '@taskItem/components/CategoryCard';
import HorizontalRule from '@app/components/HorizontalRule';
import PriceBreakdown from '@app/taskItem/components/PriceBreakdown';
import CategoryChip from './CategoryChip';
import { theme } from '@utils/color';
import { isEmpty, isDefined } from '@utils/utils';

const ItemWrapper = styled.div`
  margin-top: 1em;
  width: 95%;
`;

const JobItemHeader = styled.div`
  font-size: 1.5em;
`;

const TaskDescriptionContainer = styled.div`
  display: flex;
`;

const TaskDescription = styled.div`
  margin-left: .5em;
  border: 1px solid transparent;
  flex: 1;
  padding: .5em;
  min-height: 2em;
  color: ${props => props.isEmpty ? theme.text.light.hex : 'inherit' };
  &:hover {
    border: 1px solid ${theme.components.border.hex}
    border-radius: 5px;
  }
`;

const ChipContainer = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

const TableContainer = styled.div`
  width: 100%;
`;

const FilterTitle = styled.div`
  font-size: 1.2em;
  color: ${theme.text.dark.hex};
  padding-right: 1em;
`;

const FilterContainer = styled.div`
  display: flex;
  margin-top: 1em;
`

const Icon = styled.i`
  color: ${theme.text.light.hex};
  margin-top: .3em;
`;

const columns = [
  {
    name: 'description',
    style: 'text',
  },
  {
    name: 'quantity',
    style: 'number',
  },
  {
    name: 'price',
    style: 'currency',
  },
  {
    name: 'total',
    style: 'currency',
  },
];

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategories: this.props.categories.map(cat => cat.url),
      items: this.props.items
    };
  }

  selectCategory = (catUrl) => {
    let selectedCategories = this.state.selectedCategories.includes(catUrl)
      ? this.state.selectedCategories.filter(cat => cat !== catUrl)
      : [...this.state.selectedCategories, catUrl];
    let items = this.props.items.filter(item => selectedCategories.includes(item.category));
    this.setState({
      items: this.props.items.filter(item => selectedCategories.includes(item.category)),
      selectedCategories
    });
  }

  createTable() {
    if (isEmpty(this.props.items)) {
      return null;
    }
    return (
      <Table
        columns={columns}
        rows={this.state.items}
      />
    );
  }

  categoryFilters() {
    if (isEmpty(this.props.items)) {
      return null;
    }
    return (
      <FilterContainer>
        <FilterTitle>
          Category:
        </FilterTitle>
        <ChipContainer>
          {this.generateCategoryChips()}
        </ChipContainer>
      </FilterContainer>
    );
  }

  itemPriceBreakdown() {
    return this.state.items.reduce((breakdown, row) => (
      {
        tax: breakdown.tax + row.tax,
        total: breakdown.total + row.total + row.tax + row.markup,
        markup: breakdown.markup + row.markup
      }
    ), {
      tax: 0,
      total: 0,
      markup: 0
    });
  }

  generateCategoryChips() {
    let categoriesWithItems = this.props.categories.filter(category => (
      this.props.items.some(item => item.category === category.url)
    ));
    return categoriesWithItems.map(cat => (
      <CategoryChip
        key={cat.url}
        value={cat.name}
        color={cat.color}
        selected={this.state.selectedCategories.includes(cat.url)}
        onClick={() => this.selectCategory(cat.url)}
      />
    ))
  }

  render() {
    return (
      <ItemWrapper>
        <JobItemHeader>
          {this.props.selectedTask.title}
        </JobItemHeader>
        <HorizontalRule />
        <TaskDescriptionContainer>
          <Icon className="material-icons">notes</Icon>
          <TaskDescription
            isEmpty={isEmpty(this.props.selectedTask.description)}
          >
            {this.props.selectedTask.description || 'Description'}
          </TaskDescription>
        </TaskDescriptionContainer>
        <HorizontalRule />
        {this.categoryFilters()}
        <PriceBreakdown
          {...this.itemPriceBreakdown()}
        />
        <TableContainer>
          {this.createTable()}
        </TableContainer>
      </ItemWrapper>
    );
  }
}
