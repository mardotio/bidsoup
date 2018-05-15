import * as React from 'react';
import styled from 'styled-components';
import { withProps } from '../../utils/styling';
import { beautifyNumber } from '../../utils/styling';

interface TaskProps {
  indent?: string;
  width?: string;
}

const Task = withProps<TaskProps>()(styled.div)`
  display: block;
  padding: 10px;
  margin-left: ${props => props.indent || '0px'};
  width: ${props => props.width || '100%'};
  position: relative;
  background-color: #F4F3F3;
  &:hover {
    background-color: #FCFAFA;
  }
`;

export enum ArrowStyle {
  Collapsed,
  Expanded,
}

interface TriangleProps {
  arrow?: ArrowStyle;
}

const Triangle = withProps<TriangleProps>()(styled.i)`
  transition: transform 0.4s ease;
  visibility: ${props => typeof props.arrow === 'undefined' ? 'hidden' : 'visible'};
  transform: ${props => (
    props.arrow === ArrowStyle.Expanded
      ? 'rotate(180deg)'
      : 'rotate(0)'
  )}
`;

const Title = styled.div`
  display: inline-block;
  font-size: 110%;
  padding: 5px 10px;
  min-width: 40px;
  max-width: 800px;
`;

const Cost = styled.div`
  display: inline-block;
  padding: 5px 10px;
  font-size: 110%;
  font-weight: bold;
  float: right;
`;

const buildCostString = (cost: number, containedCost: number) => {
  if (cost > 0 && containedCost > 0) {
    // Show as fraction
    return beautifyNumber(cost, 2) + '/' + beautifyNumber(containedCost + cost, 2);
  } else if (cost > 0) {
    // No children with associated cost
    return beautifyNumber(cost, 2);
  } else {
    return beautifyNumber(containedCost, 2);
  }
};

interface Props {
  url: string;
  title: string;
  cost: number;
  containedCost: number;
  arrow?: ArrowStyle;
  indent?: string;
  width?: string;
  onArrowClick?(index: string): void;
  onTaskClick(index: string): void;
}

class TaskRow extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {hovered: false};
  }

  mouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({
      hovered: true
    });
  }

  mouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({
      hovered: false
    });
  }

  onArrowClick = (e: React.MouseEvent<HTMLElement>) => {
    if (this.props.onArrowClick) {
        this.props.onArrowClick(this.props.url);
        e.stopPropagation();
      }
  }

  render() {
    return (
      <Task
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        indent={this.props.indent}
        width={this.props.width}
        onClick={e => this.props.onTaskClick(this.props.url)}
      >
        <Triangle
         arrow={this.props.arrow}
         className="material-icons"
         onClick={this.onArrowClick}
        >
          arrow_drop_up
        </Triangle>
        <Title>
          {this.props.title}
        </Title>
        <Cost>
          ${buildCostString(this.props.cost, this.props.containedCost)}
        </Cost>
      </Task>
    );
  }
}

export default TaskRow;
