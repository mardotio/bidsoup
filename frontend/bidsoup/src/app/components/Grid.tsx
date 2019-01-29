import * as React from 'react';
import styled from 'styled-components';
import { theme } from '@utils/color';

interface Props {
  cells: JSX.Element[];
  containerId: string;
  maxColumns: number;
  alignment?: 'left' | 'right' | 'center';
  cardWidth?: number;
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
  alignment: Props['alignment'];
}

const Container = styled.ul<ContainerProps>`
  width: ${props => props.calculatedWidth + 'px'};
  height: 100%;
  padding-left: ${props => (props.sidePadding.left + 'px')};
  padding-right: ${props => (props.sidePadding.right + 'px')};
  margin: 0;
  overflow: scroll;
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
  margin: ${props => {
    switch (props.alignment) {
      case 'left': return '0 1em 1em 0';
      case 'center': return '0 .5em 1em .5em';
      case 'right': return '0 0 1em 1em';
      default: return '0';
    }
  }};
`;

export default class Grid extends React.Component<Props, State> {
  static defaultProps = {
    alignment: 'center',
    cardWidth: 16
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
    return (
      <CellContainer
        key={key}
        cardWidth={this.props.cardWidth!}
        alignment={this.props.alignment}
      >
        {item}
      </CellContainer>
    );
  }

  calculateWidth = () => {
    const cardPxWidth = (this.props.cardWidth! + 1) * this.state.em;
    let width = 0;
    for (let i = 0; i <= this.props.maxColumns; i++) {
      let newWidth = cardPxWidth * i;
      if (newWidth < (this.state.gridWidth - 5)) {
        width = newWidth;
      }
    }
    return width + 5;
  }

  calculatePadding = () => {
    let width = this.calculateWidth();
    switch (this.props.alignment) {
      case 'left':
        return {
          left: 0,
          right: (this.state.gridWidth - width)
        };
      case 'center':
        return {
          left: (this.state.gridWidth - width) / 2,
          right: (this.state.gridWidth - width) / 2
        };
      case 'left':
        return {
          left: (this.state.gridWidth - width),
          right: 0
        };
      default:
        throw(`Grid does not support ${this.props.alignment} alignment`);
    }
  }

  cellArray = () => {
    let width = this.calculateWidth();
    return (
      <Container
        calculatedWidth={width}
        sidePadding={this.calculatePadding()}
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
