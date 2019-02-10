import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import HorizontalRule from '@app/components/HorizontalRule';
import UnitForm from '@dashboard/components/UnitForm';
import GhostButton from '@app/components/GhostButton';
import { Unit } from '@app/types/types';
import { theme } from '@utils/color';
import { beautifyNumber } from '@utils/styling';
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
  margin-bottom: 2em;
  div:first-child {
    font-size: 1.25em;
  };
`;

const Unit = styled.div`
  flex: 1;
  min-width: 15em;
  justify-content: space-between;
  div:last-child {
    font-size: .8em;
    padding-top: .5em;
    color: ${theme.text.light.hex};
  };
`;

const Table = styled.div`
  width: 100%;
`;

const Row = styled.ul`
  display: flex;
  align-items: center;
  padding: .7em 0;
  list-style: none;
  width: 100%;
  margin: 0;
  border-bottom: 1px solid ${theme.components.border.hex};
`;

const TableHeader = styled(Row)`
  color: ${theme.text.light.hex};
  font-size: .95em;
  border: 0;
`;

const Cell = styled.li`
  display: inline-block;
  width: 33%;
`;

const generateRowFromUnit = (unit: Unit) => {
  return (
    <Row key={unit.url}>
      <Cell>
        <Unit key={unit.url}>
          <div>{unit.name}</div>
          <div>{unit.description}</div>
        </Unit>
      </Cell>
      <Cell>${beautifyNumber(unit.unitPrice, 2)}</Cell>
      <Cell>{unit.unit}</Cell>
    </Row>
  );
};

const generateTableFromUnits = (units: Unit[]) => {
  return (
    <Table>
      <TableHeader>
        <Cell>Name</Cell>
        <Cell>Price</Cell>
        <Cell>Unit</Cell>
      </TableHeader>
      {units.map(generateRowFromUnit)}
    </Table>
  );
};

export default class UnitDashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isBeingEdited: false,
      unit: null,
    };
  }

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
        <FormContainer
          shouldDisplay={this.state.isBeingEdited}
        >
          <UnitForm
            submitAction={this.submitForm}
            cancelAction={this.closeForm}
          />
          <HorizontalRule/>
        </FormContainer>
        {generateTableFromUnits(this.props.units)}
      </Container>
    );
  }
}
