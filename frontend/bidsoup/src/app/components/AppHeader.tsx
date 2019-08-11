import * as React from 'react';
import styled from 'styled-components';
import { Color, theme } from '@utils/color';

interface Props {
  username: string;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${Color.shade(0).hex};
  padding: .5em 2em;
  box-shadow: 0 1px 3px 0 rgba(21,27,38,.15);
`;

const AppName = styled.h1`
  margin: 0;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.text.medium.hex};
`;

const UserBubble = styled.div`
  align-items: center;
  border-radius: 10em;
  border: 1px solid ${theme.text.medium.hex};
  display: flex;
  height: 2em;
  justify-content: center;
  user-select: none;
  width: 2em;
`;

const UserName = styled.div`
  margin-left: 1em;
`;

const AppHeader = (props: Props) => {
  return (
    <Container>
      <AppName>Bidsoup</AppName>
      <UserSection>
        <UserBubble>
          <i className="material-icons">person</i>
        </UserBubble>
        <UserName>{props.username}</UserName>
      </UserSection>
    </Container>
  );
};

export default AppHeader;
