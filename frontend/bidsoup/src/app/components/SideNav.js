import React from 'react';
import styled from 'styled-components';
import { Route, matchPath } from 'react-router-dom';
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
  background-color: ${props => props.selected ? theme.primary.darken(.1) : 'inherit'};
  &:hover {
    background-color: ${theme.primary.darken(.1)};
  }
`

const doesPathMatch = (current, expected) => (
  expected.reduce((found, match) => (
    matchPath(current, {path: match, strict: true, exact: true}) || found
  ), false)
);

const generateIcons = ({icons, location}) => (
  icons.map(icon => (
    <div
      key={icon.title}
      title={icon.title}
    >
      <Link to={icon.route}>
        <NavIcon
          className="material-icons"
          selected={doesPathMatch(location.pathname, icon.matches)}
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
      {generateIcons(props)}
    </NavContainer>
  );
};

export default SideNav;
