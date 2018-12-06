import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Unit } from '@app/types/types';
import HorizontalRule from '@app/components/HorizontalRule';
import { theme } from '@utils/color';
import { beautifyNumber } from '@utils/styling';
import UnitForm from '@dashboard/components/UnitForm';
import GhostButton from '@app/components/GhostButton';
import { Actions } from '@taskItem/actions/unitTypeActions';

interface Props {
  units: Unit[];
  createUnitType: (u: Partial<Unit>) => Promise<Actions>;
}

interface FormContainerProps {
  shouldDisplay: boolean;
}

interface State {
  isBeingEdited: boolean;
  unit: string | null;
}

const Container = styled.div`
  padding: 2em 0 1em 0;
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
  max-height: ${props => props.shouldDisplay ? '9.5em' : '0'};
  transition: max-height .8s ease;
  ${ props => (
    props.shouldDisplay
      ? overflowAnimation
      : 'overflow: hidden'
  )};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  div:first-child {
    font-size: 1.25em;
    color: ${theme.text.medium.hex};
    padding: .3em 0;
  };
`;

const UnitListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Unit = styled.div`
  flex: 1;
  padding: 1em 0;
  min-width: 15em;
  justify-content: space-between;
  div:last-child {
    font-size: .8em;
    padding-top: .5em;
    color: ${theme.text.light.hex};
  };
`;

export default class UnitDashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isBeingEdited: false,
      unit: null,
    };
  }

  generateUnitList = () => (
    this.props.units.map(unit => (
      <Unit key={unit.url}>
        <div>{unit.name}</div>
        <div>${beautifyNumber(unit.unitPrice, 2)}/{unit.unit}</div>
      </Unit>
    ))
  )

  setEditingState = (isBeingEdited: boolean) => {
    this.setState({isBeingEdited});
  }

  displayAddButton = () => {
    if (this.state.isBeingEdited) {
      return null;
    }
    return (
      <GhostButton
        onClick={() => this.setEditingState(true)}
      >
        New Unit
      </GhostButton>
    );
  }

  closeForm = () => {
    this.setState({
      isBeingEdited: false
    });
  }

  submitForm = (u: Partial<Unit>) => {
    this.props.createUnitType(u);
    this.closeForm();
  }

  render = () => {
    return (
      <Container>
        <Header>
          <div>Units</div>
          {this.displayAddButton()}
        </Header>
        <HorizontalRule/>
        <FormContainer
          className="Testing"
          shouldDisplay={this.state.isBeingEdited}
        >
          <UnitForm
            submitAction={this.submitForm}
            cancelAction={this.closeForm}
          />
          <HorizontalRule/>
        </FormContainer>
        <UnitListContainer>
          {this.generateUnitList()}
        </UnitListContainer>
      </Container>
    );
  }
}
