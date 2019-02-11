import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { determineFontColor } from '@utils/styling';
import { theme } from '@utils/color';

interface Props {
  color: string;
  icon: string;
  mini?: boolean;
  overrideColor?: boolean;
  onClick: () => void;
}

interface ButtonContainerProps {
  buttonColor: string;
  overrideFont: boolean;
  isMini: boolean;
}

const defaultSize = '56px';
const miniSize = '40px';

const expandIn = () => {
  let frames = keyframes`
    0%{transform: scale(0)}
    100%{transform: scale(1)}
  `;
  return  css`
    animation: .28s ${frames} ease-in;
  `;
};

const ButtonContainer = styled.div<ButtonContainerProps>`
  align-items: center;
  ${expandIn};
  background-color: ${({buttonColor}) => buttonColor};
  border-radius: 50%;
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  color: ${({buttonColor, overrideFont}) => determineFontColor(
    buttonColor, overrideFont, theme.text.medium.hex
  )};
  cursor: pointer;
  display: flex;
  height: ${({isMini}) => isMini ? miniSize : defaultSize};
  justify-content: center;
  margin: 24px;
  transition: box-shadow .28s;
  user-select: none;
  width: ${({isMini}) => isMini ? miniSize : defaultSize};
  &:hover {
    box-shadow:
      0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12),
      0 5px 5px -3px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonIcon = styled.i`
  height: 24px;
  width: 24px;
`;

const Fab = (props: Props) => {
  return (
    <ButtonContainer
      buttonColor={props.color}
      isMini={props.mini || false}
      onClick={() => props.onClick()}
      overrideFont={props.overrideColor || false}
    >
      <ButtonIcon className="material-icons">
        {props.icon}
      </ButtonIcon>
    </ButtonContainer>
  );
};

export default Fab;
