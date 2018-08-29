import React from 'react';
import styled from 'styled-components';
import { Route } from "react-router-dom";
import Link from './Link';
import { theme } from '../utils/color';

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.background};
  text-align: center;
  padding: 1em 0;
  width: 100px;
  height: 100%;
`;

const NavIcon = styled.i`
  height: 24px;
  width: 24px;
  padding: 1em;
  cursor: pointer;
  &:hover {
  color: ${theme.primary};
  }
`

const generateIcons = iconList => (
  iconList.map(icon => (
    <div
      key={icon.title}
      title={icon.title}
    >
      <Link to={icon.route}>
        <NavIcon
          className="material-icons"
        >
          {icon.icon}
        </NavIcon>
      </Link>
    </div>
  ))
)

const SideNav = props => {
  return (
    <NavContainer>
      {generateIcons(props.icons)}
    </NavContainer>
  );
};

export default SideNav;
