import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '@utils/color';

interface Props {
  account: string;
  close: () => void;
}

const Container = styled.div`
  border-bottom: 1px solid ${theme.components.border.hex};
  padding: 0 3em;
  display: flex;
  justify-content: flex-end;
`;

const HeaderIcon = styled.i`
  padding:  .5em 0 .5em 1em;
  color: ${theme.text.medium.hex};
  cursor: pointer;
  &:hover {
    color: ${theme.text.dark.hex};
  }
`;

const HiddenInput = styled.input`
  opacity: 0;
  position: absolute;
  height: 0;
  z-index: -100;
`;

const copyToClipboard = () => {
  let url = document.getElementById('bid-url-field') as HTMLInputElement;
  if (url && url.select) {
    url.select();
    document.execCommand('copy');
  }
};

const ActionsHeader = (props: Props) => {
  return (
    <Container>
      <HeaderIcon
        className="material-icons"
        onClick={copyToClipboard}
      >
        link
      </HeaderIcon>
      <Link to={`/${props.account}/bids`}>
        <HeaderIcon
          className="material-icons"
          onClick={props.close}
        >
          clear
        </HeaderIcon>
      </Link>
      <HiddenInput
        value={window.location.href}
        id="bid-url-field"
        type="readonly"
        readOnly={true}
      />
    </Container>
  );
};

export default ActionsHeader;
