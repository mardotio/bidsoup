import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';

const circleAnimation = (percent: number) => {
  const frames = keyframes`
    100% {
      stroke-dashoffset: ${percent};
    }
  `;
  return css`
    animation: ${frames} 1s ease-out forwards;
  `;
};

interface CircleProps {
  circumference: number;
  percent: number;
}

const Circle = styled.circle<CircleProps>`
  stroke-dasharray: ${({circumference}) => circumference};
  stroke-dashoffset: ${({circumference}) => circumference};
  stroke-linecap: round;
  ${({percent}) => circleAnimation(percent)};
`;

const SvgContainer = styled.svg`
  transform: rotate(-90deg);
`;

interface DonutProps {
  radius: number;
  stroke: number;
  color: string;
  percent: number;
  altColor: string;
  offsetStroke: number;
}

const calculateCircleDimensions = ({ radius, stroke, percent }: DonutProps) => {
  let diameter = radius * 2;
  let circumference = Math.round(Math.PI * diameter);
  let actualPercent = percent >= 1 ? percent : 1;
  return {
    outsideDiameter: diameter + stroke * 2,
    center: radius + stroke,
    filledPercent: Math.round(((1 - actualPercent / 100) * circumference)),
    circumference
  };
};

const DonutGraph = (props: DonutProps) => {
  let circle = calculateCircleDimensions(props);
  return(
    <SvgContainer
      width={circle.outsideDiameter}
      height={circle.outsideDiameter}
    >
      <circle
        r={props.radius}
        cy={circle.center}
        cx={circle.center}
        strokeWidth={props.stroke - props.offsetStroke}
        stroke={props.altColor}
        fill="none"
      />
      <Circle
        r={props.radius}
        cy={circle.center}
        cx={circle.center}
        strokeWidth={props.stroke}
        stroke={props.color}
        circumference={circle.circumference}
        percent={circle.filledPercent}
        fill="none"
      />
    </SvgContainer>
  );
};

export default DonutGraph;
