import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import GhostButton from '@app/components/GhostButton';
import Table from '@taskItem/components/Table';
import HorizontalRule from '@app/components/HorizontalRule';
import { StandardizedItem } from '@utils/conversions';
import { Category } from '@app/types/types';
import { theme } from '@utils/color';
import NewItemFormContainer from '../containers/NewItemFormContainer';

interface Props {
  items: StandardizedItem[];
  categories: Category[];
  columns: {
    name: keyof StandardizedItem;
    style: 'text' | 'number' | 'currency' | 'default';
  }[];
}

interface State {
  isBeingEdited: boolean;
}

interface FormContainerProps {
  shouldDisplay: boolean;
}

const Container = styled.div`
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  color: ${theme.text.medium.hex};
  font-size: 1.25em;
  padding: .3em 0;
`;

const overflowAnimation = () => {
  let frames = keyframes`
    from { overflow: hidden; }
  `;
  return css`
    animation: .8s ${frames} ease;
  `;
};

const FormContainer = styled.div<FormContainerProps>`
  max-height: ${props => props.shouldDisplay ? '15em' : '0'};
  transition: max-height .8s ease;
  ${ props => (
    props.shouldDisplay
      ? overflowAnimation
      : 'overflow: hidden'
  )};
`;

class Items extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isBeingEdited: false,
    };
  }

  displayForm = () => {
    this.setState({isBeingEdited: true});
  }

  hideForm = () => {
    this.setState({isBeingEdited: false});
  }

  render() {
    return (
      <Container>
        <Header>
          <Title>Items</Title>
          <GhostButton
            onClick={this.displayForm}
          >
            Add Item
          </GhostButton>
        </Header>
        <HorizontalRule/>
        <FormContainer
          shouldDisplay={this.state.isBeingEdited}
        >
          <NewItemFormContainer
            submitAction={this.hideForm}
            cancelAction={this.hideForm}
          />
          <HorizontalRule/>
        </FormContainer>
        <Table
          columns={this.props.columns}
          rows={this.props.items}
        />
      </Container>
    );
  }
}

export default Items;
