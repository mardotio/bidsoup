import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import Link from '@app/components/Link';
import { theme } from '@utils/color';

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.primary.hex};
  text-align: center;
  padding: 1em 0;
  width: 6em;
  height: 100%;
`;

const NavIcon = styled.i`
  height: 24px;
  width: 24px;
  padding: .5em;
  margin: .5em;
  color: ${theme.background.hex};
  border-radius: .3em;
  cursor: pointer;
  &:hover {
    background-color: ${theme.primary.darken(.1)};
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
