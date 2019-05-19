import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import GhostButton from '@app/components/GhostButton';
import Table from '@taskItem/components/Table';
import HorizontalRule from '@app/components/HorizontalRule';
import { StandardizedItem } from '@utils/conversions';
import { Category } from '@app/types/types';
import { Color, theme } from '@utils/color';
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

const SectionTitle = styled.div`
  margin-top: 1em;
  color: ${theme.primary.hex};
  &:after {
    content: "";
    width: 3em;
    height: 1px;
    background-color: ${theme.components.darkBorder.hex};
    display: block;
    margin-top: .2em;
  }
`;


const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const ItemsContainer = styled.div`
  padding: 1em;
  margin-top: 1em;
  background-color: ${Color.shade(0).hex};
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
      <div>
        <Header>
          <div>
            <SectionTitle>Items</SectionTitle>
          </div>
          <GhostButton
            onClick={this.displayForm}
          >
            Add Item
          </GhostButton>
        </Header>
        <FormContainer
          shouldDisplay={this.state.isBeingEdited}
        >
          <NewItemFormContainer
            submitAction={this.hideForm}
            cancelAction={this.hideForm}
          />
          <HorizontalRule/>
        </FormContainer>
        <ItemsContainer>
          <Table
            columns={this.props.columns}
            rows={this.props.items}
          />
        </ItemsContainer>
      </div>
    );
  }
}

export default Items;
