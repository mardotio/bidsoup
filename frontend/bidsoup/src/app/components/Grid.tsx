import * as React from 'react';
import styled from 'styled-components';
import { theme } from '@utils/color';

const cardWidth = 16;

interface Props {
  cells: JSX.Element[];
  containerId: string;
  maxColumns: number;
}

interface State {
  gridWidth: number;
  em: number;
}

interface ContainerProps {
  calculatedWidth: number;
  sidePadding: number;
}

interface CellProps {
  cardWidth: number;
}

const Container = styled.ul<ContainerProps>`
  width: ${props => props.calculatedWidth + 'px'};
  height: 100%;
  padding-left: ${props => (props.sidePadding + 'px')};
  padding-right: ${props => (props.sidePadding + 'px')};
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
  margin: 0 .5em 1em .5em
`;

export default class Grid extends React.Component<Props, State> {
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
        cardWidth={cardWidth}
      >
        {item}
      </CellContainer>
    );
  }

  calculateWidth = () => {
    const cardPxWidth = (cardWidth + 1) * this.state.em;
    let width = 0;
    for (let i = 0; i <= this.props.maxColumns; i++) {
      let newWidth = cardPxWidth * i;
      if (newWidth < (this.state.gridWidth - 5)) {
        width = newWidth;
      }
    }
    return width + 5;
  }

  cellArray = () => {
    let width = this.calculateWidth();
    let padding = (this.state.gridWidth - width) / 2;
    return (
      <Container
        calculatedWidth={width}
        sidePadding={padding}
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
