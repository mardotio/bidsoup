import * as React from 'react';
import styled from 'styled-components';
import { beautifyNumber } from '@utils/styling';
import { theme } from '@utils/color';

const Task = styled.div`
  display: flex;
  align-items: center;
  padding: .8em;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  &:hover {
    background-color: ${theme.interactions.hover.hex};
  }
  cursor: pointer;
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

const onArrowClick = (e: React.MouseEvent<HTMLElement>, props: Props) => {
  if (props.onArrowClick) {
    props.onArrowClick(props.url);
    e.stopPropagation();
  }
}

const TaskRow = (props: Props) => {
  let uuid = props.url.match(/[0-9a-z]{8}-[0-9a-z-]+/i)![0];
  return (
    <Task
      onClick={() => props.onTaskClick(uuid)}
    >
      <Title>
        <Triangle
          arrow={props.arrow}
          className="material-icons"
          onClick={e => onArrowClick(e, props)}
          indent={props.indent}
        >
          arrow_drop_up
        </Triangle>
        {props.title}
      </Title>
      <Cost>
        ${buildCostString(props.cost, props.containedCost)}
      </Cost>
    </Task>
  );
};

export default TaskRow;
