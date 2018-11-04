import * as React from 'react';
import styled from 'styled-components';
import { CrewMember } from '../../types/types';
import { getInitials } from '../../utils/utils';
import HorizontalRule from '../../components/HorizontalRule';
import { theme } from '../../utils/color';
import CircleInitials from '../../components/CircleInitials';
import GhostButton from '../../components/GhostButton';

const Container = styled.div`
  padding: 2em 0;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  div:first-child {
    font-size: 1.25em;
    color: ${theme.text.medium};
  };
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Item = styled.div`
  flex: 1;
  flex-shrink: 0;
  min-width: 15em;
  padding: 1em 0;
  display: flex;
  align-items: center;
`;

const Details = styled.div`
  padding-left: 1em;
  div:last-child {
    color: ${theme.text.light};
    padding-top: .5em;
    font-size: .8em;
  };
`;

interface Props {
  crew: CrewMember[];
}

const generateCrewList = ({ crew }: Props) => (
  crew.map(member => (
    <Item key={member.first + member.last + member.position}>
      <CircleInitials
        color={member.color}
        initials={getInitials(member.first)}
        size={2}
        clickable={true}
      />
      <Details>
        <div>{`${member.first} ${member.last}`}</div>
        <div>{member.position}</div>
      </Details>
    </Item>
  ))
);

const CrewDashboard = (props: Props) => {
  return (
    <Container>
      <Header>
        <div>Team</div>
        <GhostButton
          onClick={() => (null)}
        >
          Add Member
        </GhostButton>
      </Header>
      <HorizontalRule/>
      <List>
        {generateCrewList(props)}
      </List>
    </Container>
  );
};

export default CrewDashboard;
