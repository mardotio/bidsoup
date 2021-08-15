import * as React from 'react';
import styled from 'styled-components';
import { theme } from '@utils/color';

interface Props {
  cells: JSX.Element[];
  containerId: string;
  maxColumns: number;
  alignment?: 'left' | 'right' | 'center';
  cardWidth?: number;
  margin: 'auto' | number;
}

interface State {
  gridWidth: number;
  em: number;
}

interface ContainerProps {
  calculatedWidth: number;
  sidePadding: {
    left: number;
    right: number;
  };
}

interface CellProps {
  cardWidth: number;
  cardMargin: {
    left: number;
    right: number;
  };
}

const Container = styled.ul<ContainerProps>`
  width: ${props => props.calculatedWidth + 'px'};
  height: 100%;
  padding-left: ${props => (props.sidePadding.left + 'px')};
  padding-right: ${props => (props.sidePadding.right + 'px')};
  margin: 0;
  overflow: auto;
  list-style: none;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.components.scrollbar.hex};
  }
`;

const CellContainer = styled.li<CellProps>`
  width: ${props => props.cardWidth + 'em'};
  display: inline-block;
  margin-left: ${props => props.cardMargin.left}em;
  margin-right: ${props => props.cardMargin.right}em;
  margin-top: 1em;
`;

export default class Grid extends React.Component<Props, State> {
  static defaultProps = {
    alignment: 'center',
    cardWidth: 16,
    margin: 1
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      gridWidth: 0,
      em: 0
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resetContainerWidth);
    this.resetContainerWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resetContainerWidth);
  }

  resetContainerWidth = () => {
    let parent = document.getElementById(this.props.containerId);
    if (parent && parent.clientWidth !== this.state.gridWidth) {
      let style = window.getComputedStyle(parent, null);
      this.setState({
        gridWidth: parent.clientWidth,
        em: parseFloat(style.fontSize || '0')
      });
    } else if (parent && parent.clientWidth === this.state.gridWidth) {
      let style = window.getComputedStyle(parent, null);
      this.setState(
        {
          gridWidth: 0,
          em: parseFloat(style.fontSize || '0')
        },
        this.resetContainerWidth
      );
    }
  }

  createCell = (item: JSX.Element, key: number) => {
    let width = this.calculateWidth();
    return (
      <CellContainer
        key={key}
        cardWidth={this.props.cardWidth!}
        cardMargin={this.calculatePadding(width.margin)}
      >
        {item}
      </CellContainer>
    );
  }

  calculateAutoMarginWidth = () => {
    const minCardWidth = this.props.cardWidth! * this.state.em;
    let cardsPerRow = 1;
    let sizes = {
      width: this.state.gridWidth,
      margin: 0
    };
    for (let i = this.props.maxColumns; i >= 1; i--) {
      if (cardsPerRow === 1) {
        let newWidth = minCardWidth * i;
        if (newWidth <= (this.state.gridWidth - 5)) {
          cardsPerRow = i;
          sizes = {
            width: this.state.gridWidth,
            margin: (((this.state.gridWidth - 5) - newWidth) / i) / this.state.em
          };
        }
      }
    }
    return sizes;
  }

  calculateStaticMarginWidth = () => {
    const cardPxWidth = (this.props.cardWidth! + (this.props.margin as number)) * this.state.em;
    let width = 0;
    for (let i = 0; i <= this.props.maxColumns; i++) {
      let newWidth = cardPxWidth * i;
      if (newWidth < (this.state.gridWidth - 5)) {
        width = newWidth;
      }
    }
    return {
      width: width + 5,
      margin: this.props.margin as number
    };
  }

  calculateWidth = () => (
    typeof this.props.margin === 'string'
      ? this.calculateAutoMarginWidth()
      : this.calculateStaticMarginWidth()
  )

  calculatePadding = (emptySpace: number) => {
    switch (this.props.alignment) {
      case 'left':
        return {
          left: 0,
          right: emptySpace
        };
      case 'center':
        return {
          left: emptySpace / 2,
          right: emptySpace / 2
        };
      case 'right':
        return {
          left: emptySpace,
          right: 0
        };
      default:
        throw(new Error(`Grid does not support ${this.props.alignment} alignment`));
    }
  }

  cellArray = () => {
    let width = this.calculateWidth();
    return (
      <Container
        calculatedWidth={width.width}
        sidePadding={this.calculatePadding(this.state.gridWidth - width.width)}
      >
        {this.props.cells.map(this.createCell)}
      </Container>
    );
  }

  render() {
    return this.state.gridWidth > 0
      ? this.cellArray()
      : null;
  }
}
