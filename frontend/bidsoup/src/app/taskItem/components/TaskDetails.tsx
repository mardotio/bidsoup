import * as React from 'react';
import styled from 'styled-components';
import HorizontalRule from '@app/components/HorizontalRule';
import Table from '@taskItem/components/Table';
import PriceBreakdown from '@taskItem/components/PriceBreakdown';
import CategoryChip from '@taskItem/components/CategoryChip';
import Items from '@taskItem/components/Items';
import EditTaskFormContainer from '@taskItem/containers/EditTaskFormContainer';
import { theme } from '@utils/color';
import { isEmpty, includes } from '@utils/utils';
import { StandardizedItem } from '@utils/conversions';
import { Category, BidTask } from '@app/types/types';

interface Props {
  items: StandardizedItem[];
  categories: Category[];
  selectedTask: BidTask;
}

interface State {
  selectedCategories: string[];
  items: StandardizedItem[];
}

const Container = styled.div``;

const ItemWrapper = styled.div`
  padding: 0 2em;
`;

const ChipContainer = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

const FilterTitle = styled.div`
  font-size: 1.2em;
  color: ${theme.text.dark.hex};
  padding-right: 1em;
`;

const FilterContainer = styled.div`
  display: flex;
  margin-top: 1em;
`;

const columns: {
  name: keyof StandardizedItem;
  style: 'text' | 'number' | 'currency' | 'default';
}[] = [
  {
    name: 'description',
    style: 'text'
  },
  {
    name: 'quantity',
    style: 'number'
  },
  {
    name: 'price',
    style: 'currency'
  },
  {
    name: 'total',
    style: 'currency'
  },
];

export default class TaskDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedCategories: this.props.categories.map(cat => cat.url),
      items: this.props.items
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.items.length !== prevProps.items.length) {
      this.setState(prevState => ({
        items: this.filterItems(prevState.selectedCategories)
      }));
    }
  }

  filterItems(selectedCategories: string[]) {
    return this.props.items.filter(item => includes(selectedCategories, item.category));
  }

  selectCategory = (catUrl: string) => {
    let selectedCategories = includes(this.state.selectedCategories, catUrl)
      ? this.state.selectedCategories.filter(cat => cat !== catUrl)
      : [...this.state.selectedCategories, catUrl];
    this.setState({
      items: this.filterItems(selectedCategories),
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
    return this.state.items.reduce(
      (breakdown, row) => (
        {
          tax: breakdown.tax + row.tax,
          total: breakdown.total + row.total + row.tax + row.markup,
          markup: breakdown.markup + row.markup
        }
      ),
      {
        tax: 0,
        total: 0,
        markup: 0
      }
    );
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
        selected={includes(this.state.selectedCategories, cat.url)}
        onClick={() => this.selectCategory(cat.url)}
      />
    ));
  }

  render() {
    return (
      <Container>
        <EditTaskFormContainer/>
        <ItemWrapper>
          <HorizontalRule />
          {this.categoryFilters()}
          <PriceBreakdown
            {...this.itemPriceBreakdown()}
          />
          <Items
            columns={columns}
            items={this.state.items}
            categories={this.props.categories}
          />
        </ItemWrapper>
      </Container>
    );
  }
}
