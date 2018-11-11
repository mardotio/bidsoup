import * as React from 'react';
import styled from 'styled-components';
import Card from '../../components/Card';
import { CategoryWithItems } from './Dashboard';
import DonutGraph from '../../components/DonutGraph';
import { theme } from '../../utils/color';
import { beautifyNumber } from '../../utils/styling';
import HorizontalRule from '../../components/HorizontalRule';

interface Props {
  categoriesWithItems: {
    [k: string]: CategoryWithItems;
  };
}

interface State {
  displayTotals: boolean;
  categoryTotals: {
    [k: string]: number;
  };
  categoryItemCounts: {
    [k: string]: number;
  };
}

interface ButtonProps {
  selected: boolean;
}

const Container = Card.extend`
  padding: 1em;
  margin: 1em 0;
  display: inline-block;
  //max-width: 300px;
`;

const Title = styled.div`
  color: ${theme.text.medium.hex};
  font-size: 1.1em;
  padding: 1em 0;
`;

const Item = styled.div`
  display: flex;
  padding: .5em 0;
`;

const ItemLabel = styled.div`
  padding-left: 2em;
  div:first-child {
    padding-bottom: .25em;
    font-weight: 600;
  }
  div:last-child {
    color: ${theme.text.light.hex}
    font-size: .9em;
  }
`;

const PillButton = styled.div<ButtonProps>`
  background-color: ${props => (
    props.selected
    ? theme.primary.hex
    : 'inherit'
  )};
  color: ${props => (
    props.selected
    ? 'white'
    : theme.primary.hex
  )};
  transition: .1s ease;
  transition-delay: ${props => (
    props.selected
      ? '.1s'
      : '0'
  )};
  border: 1px solid ${theme.primary.hex}
  padding: .25em 1em;
  border-radius: 1.5em;
  display: inline-block;
  margin-right: .2em;
  &:hover {
    cursor: pointer;
  }
`;

export default class CategoryDashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayTotals: false,
      categoryTotals: {},
      categoryItemCounts: {}
    };
  }

  componentDidMount() {
    this.setState({
      categoryTotals: this.calculateTotals(),
      categoryItemCounts: this.countItems()
    });
  }

  calculateTotals() {
    return (
      Object.keys(this.props.categoriesWithItems).reduce(
        (catTotals, category) => (
          {
            ...catTotals,
            [category]: this.props.categoriesWithItems[category].items.reduce(
              (total, item) => (
                total + item.total
              ),
              0
            )
          }
        ),
        {}
      )
    );
  }

  countItems() {
    return (
      Object.keys(this.props.categoriesWithItems).reduce(
        (counts, category) => (
          {
            ...counts,
            [category]: this.props.categoriesWithItems[category].items.length
          }
        ),
        {}
      )
    );
  }

  renderDash() {
    return this.state.displayTotals
      ? this.displayTotalsByCategory()
      : this.displayItemsByCategory();
  }

  displayTotalsByCategory() {
    let bidTotal = Object.keys(this.state.categoryTotals).reduce(
      (total, category) => (
        total + this.state.categoryTotals[category]
      ),
      0
    );
    let sortedTotals = Object.keys(this.state.categoryTotals).sort((a, b) => (
      this.state.categoryTotals[b] - this.state.categoryTotals[a]
    ));
    return (
      sortedTotals.map(category => (
        <Item key={`${category}-${sortedTotals}`}>
          <DonutGraph
            radius={15}
            stroke={4}
            color={`#${this.props.categoriesWithItems[category].color}`}
            percent={Math.round(this.state.categoryTotals[category] / bidTotal * 100)}
            altColor={theme.components.border.hex}
            offsetStroke={1}
          />
          <ItemLabel>
            <div>${beautifyNumber(this.state.categoryTotals[category], 2)}</div>
            <div>{this.props.categoriesWithItems[category].name}</div>
          </ItemLabel>
        </Item>
      ))
    );
  }

  displayItemsByCategory() {
    let itemTotal = Object.keys(this.state.categoryItemCounts).reduce(
      (total, category) => (
        total + this.state.categoryItemCounts[category]
      ),
      0
    );
    let sortedCounts = Object.keys(this.state.categoryTotals).sort((a, b) => (
      this.state.categoryItemCounts[b] - this.state.categoryItemCounts[a]
    ));
    return (
      sortedCounts.map(category => (
        <Item key={`${category}-${sortedCounts}`}>
          <DonutGraph
            radius={15}
            stroke={4}
            color={`#${this.props.categoriesWithItems[category].color}`}
            percent={Math.round(this.state.categoryItemCounts[category] / itemTotal * 100)}
            altColor={theme.components.border.hex}
            offsetStroke={1}
          />
          <ItemLabel>
            <div>{this.state.categoryItemCounts[category]}</div>
            <div>{this.props.categoriesWithItems[category].name}</div>
          </ItemLabel>
        </Item>
      ))
    );
  }

  setDisplay(type: string) {
    if (type === 'total' && !this.state.displayTotals) {
      this.setState({displayTotals: true});
    }
    if (type === 'count' && this.state.displayTotals) {
      this.setState({displayTotals: false});
    }
  }

  render() {
    return (
      <Container>
        <Title>
          Top Categories
        </Title>
        <PillButton
          selected={!this.state.displayTotals}
          onClick={() => this.setDisplay('count')}
        >
          By Quantity
        </PillButton>
        <PillButton
          selected={this.state.displayTotals}
          onClick={() => this.setDisplay('total')}
        >
          By Price
        </PillButton>
        <HorizontalRule />
        {this.renderDash()}
      </Container>
    );
  }
}
