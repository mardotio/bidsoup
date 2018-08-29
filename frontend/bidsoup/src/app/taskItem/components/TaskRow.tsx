import * as React from 'react';
import styled from 'styled-components';
import { beautifyNumber } from '../../utils/styling';
import { interactions } from '../../utils/color';

interface TaskProps {
  clickable: boolean;
}

const Task = styled.div<TaskProps>`
  display: flex;
  align-items: center;
  padding: 10px;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  &:hover {
    background-color: ${interactions.hover};
  }
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
`;

export enum ArrowStyle {
  Collapsed,
  Expanded,
}

interface TriangleProps {
  arrow?: ArrowStyle;
  indent?: string;
}

const Triangle = styled.i<TriangleProps>`
  transition: transform 0.5s ease;
  visibility: ${props => typeof props.arrow === 'undefined' ? 'hidden' : 'visible'};
  margin-left: ${props => props.indent || '0'};
  user-select: none;
  transform: ${props => (
    props.arrow === ArrowStyle.Expanded
      ? 'rotate(180deg)'
      : 'rotate(0)'
  )}
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  flex-basis: 40%;
`;

const Cost = styled.div`
  text-align: right;
  flex-grow: 1;
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
        onClick={e => this.props.onTaskClick(this.props.url)}
        clickable={this.props.cost > 0}
      >
        <Title>
          <Triangle
            arrow={this.props.arrow}
            className="material-icons"
            onClick={this.onArrowClick}
            indent={this.props.indent}
          >
            arrow_drop_up
          </Triangle>
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
