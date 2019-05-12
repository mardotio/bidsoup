import * as React from 'react';
import styled from 'styled-components';
import { theme } from '@utils/color';
import { curry } from 'fp-ts/lib/function';

interface Props {
  icon: string;
  label: string;
  size: 'S' | 'M' | 'L';
  action: () => void;
}

const StyledButton = styled.button`
  align-items: center;
  background-color: transparent;
  border-radius: 50%;
  border: none;
  color: ${theme.text.medium.hex};
  cursor: pointer;
  display: flex;
  font-size: 1em;
  justify-content: center;
  padding: 1em;
  transition: all .3s ease;
  &:hover, &:focus {
    background-color: rgba(0, 0, 0, .08);
    outline: none;
  }
`;

// Removed the focus halo for the button after the button is pressed. If this is not called
// the halo will remain until the user click somewhere else on the page.
const handleClick = (callback: Props['action'], e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.blur();
  callback();
};

const sizes: { [k in Props['size']]: string } = {
  S: '20px',
  M: '24px',
  L: '35px',
};

const IconButton = (props: Props) => {
  return (
    <StyledButton
      aria-label={props.label}
      onClick={curry(handleClick)(props.action)}
    >
      <i className="material-icons" style={{fontSize: sizes[props.size]}}>{props.icon}</i>
    </StyledButton>
  );
};

export default IconButton;