import * as React from 'react';
import styled from 'styled-components';
import { theme } from '@utils/color';

interface Props {
  options: IconOptions[];
}

interface IconOptions {
  icon: string;
  danger?: boolean;
  action?: () => void;
}

const Container = styled.div`
  border-bottom: 1px solid ${theme.components.border.hex};
  display: flex;
  flex-direction: row-reverse;
  padding: .5em 1em;
  margin-bottom: .5em;
`;

const Icon = styled.i`
  color: ${theme.text.light.hex};
  margin: 0 .25em;
  transition: color .2s;
  &:hover {
    color: ${theme.text.medium.hex};
    cursor: pointer;
  }
`;

const DangerIcon = styled(Icon)`
  &:hover {
    color: ${theme.danger.hex};
  }
`;

const HiddenInput = styled.input`
  opacity: 0;
  position: absolute;
  height: 0;
  z-index: -100;
`;

const copyToClipboard = () => {
  let url = document.getElementById('url-hidden-input') as HTMLInputElement;
  if (url && url.select) {
    url.select();
    document.execCommand('copy');
  }
};

const dangerIcon = (options: IconOptions) => (
  <DangerIcon
    className="material-icons"
    key={options.icon}
    onClick={options.icon === 'link' ? copyToClipboard : options.action}
  >
    {options.icon}
  </DangerIcon>
);

const standardIcon = (options: IconOptions) => (
  <Icon
    className="material-icons"
    key={options.icon}
    onClick={options.icon === 'link' ? copyToClipboard : options.action}
  >
    {options.icon}
  </Icon>
);

const icon = (options: IconOptions) => (
  options.danger === true ? dangerIcon(options) : standardIcon(options)
);

const generateIcons = (icons: Props['options']) => (
  icons.map(icon)
);

const ActionHeader = (props: Props) => {
  return (
    <Container>
      {generateIcons(props.options)}
      <HiddenInput
        value={window.location.href}
        id="url-hidden-input"
        type="readonly"
        readOnly={true}
      />
    </Container>
  );
};

export default ActionHeader;
