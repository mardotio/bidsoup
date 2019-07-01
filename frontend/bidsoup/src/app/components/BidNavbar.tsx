import * as React from 'react';
import styled from 'styled-components';
import { Link, RouteComponentProps, matchPath } from 'react-router-dom';
import { curry } from 'fp-ts/lib/function';
import { theme } from '@utils/color';

interface RouteObject {
  path: string;
  displayName: string;
  matches: string[];
}

interface Props  extends RouteComponentProps<{}> {
  account: string | null;
  bidId: number;
  taskId: string | null;
  clearSelectedBid: () => void;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 2em;
`;


interface LinkProps {
  selected: boolean;
}

const StyledLink = styled(Link)<LinkProps>`
  border-bottom: 2px solid ${props => props.selected ? theme.accent.hex : 'transparent'};
  color: ${theme.text.medium.hex};
  display: inline-block;
  font-size: 1em;
  margin-right: 2em;
  padding-bottom: .5em;
  text-decoration: none;
  transition: border-bottom-color 150ms ease;
  &:focus, &:hover, &:visited, &:link, &:active {
    text-decoration: none;
  }
`;

const HeaderIcon = styled.i`
  color: ${theme.text.medium.hex};
  cursor: pointer;
  transition: color 100ms ease;
  &:hover {
    color: ${theme.text.dark.hex};
  }
`;

const doesPathMatch = (current: string, expected: string[]) => (
  expected.reduce(
    (found, match) => (
      matchPath(current, {path: match, strict: true, exact: true}) ? true : found
    ),
    false
  )
);

const generateLink = (location: Props['location'], details: RouteObject) => (
  <StyledLink
    to={details.path}
    key={details.displayName}
    selected={doesPathMatch(location.pathname, details.matches)}
  >
    {details.displayName}
  </StyledLink>
);

const generateNavigationLinks = (routes: RouteObject[], location: Props['location']) => (
  routes.map(curry(generateLink)(location))
);

const BidNavbar = (props: Props) => {
  const routing: RouteObject[] = [
    {
      path: `/${props.account}/bids/${props.bidId}`,
      displayName: 'Overview',
      matches: ['/:account/bids/:bidId']
    }, {
      path: `/${props.account}/bids/${props.bidId}/tasks`,
      displayName: 'Tasks',
      matches: ['/:account/bids/:bidId/tasks', '/:account/bids/:bidId/tasks/:taskId']
    },
  ];

  return (
    <Container>
      <div>
        {generateNavigationLinks(routing, props.location)}
      </div>
      <Link to={`/${props.account}/bids`} onClick={props.clearSelectedBid}>
        <HeaderIcon className="material-icons">clear</HeaderIcon>
      </Link>
    </Container>
  );
};

export default BidNavbar;
