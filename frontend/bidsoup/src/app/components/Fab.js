import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { determineFontColor } from '../utils/styling'

const defaultSize = '56px';
const miniSize = '40px';

const ButtonContainer = styled.div`
  display: flex;
  border-radius: 50%;
  cursor: pointer;
  margin: 24px;
  height: ${({isMini}) => isMini ? miniSize : defaultSize};
  width: ${({isMini}) => isMini ? miniSize : defaultSize};
  background-color: ${({buttonColor}) => buttonColor};
  color: ${({buttonColor, overrideFont}) => determineFontColor(
    buttonColor, overrideFont, '#757575'
  )};
  align-items: center;
  justify-content: center;
  user-select: none;
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  transition: box-shadow .28s;
  &:hover {
    box-shadow:
      0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12),
      0 5px 5px -3px rgba(0, 0, 0, 0.2);
  }
`

const ButtonIcon = styled.i`
  height: 24px;
  width: 24px;
`

const Fab = props => {
  return (
    <ButtonContainer
      buttonColor={props.color}
      overrideFont={props.overrideColor}
      isMini={props.mini}
      onClick={() => props.onClick()}
    >
      <ButtonIcon className="material-icons">
        {props.icon}
      </ButtonIcon>
    </ButtonContainer>
  );
};

Fab.propTypes = {
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  mini: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  overrideColor: PropTypes.bool,
};

Fab.defaultProps = {
  mini: false,
  overrideColor: false,
};

export default Fab;
