import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import HorizontalRule from '@app/components/HorizontalRule';
import UnitForm from '@dashboard/components/UnitForm';
import EditUnitFormContainer from '@dashboard/containers/EditUnitFormContainer';
import { Category, Unit } from '@app/types/types';
import { Color, theme } from '@utils/color';
import { beautifyNumber } from '@utils/styling';
import { isEmpty } from '@utils/utils';

interface Props {
  units: Unit[];
  categories: Category[];
  createUnitType: (u: Partial<Unit>) => Promise<void>;
}

interface FormContainerProps {
  shouldDisplay: boolean;
}

interface State {
  isBeingEdited: boolean;
  unit: string | null;
  selectedUnit: string | null;
}

const Container = styled.div`
  background-color: ${Color.shade(0).hex};
  padding: 1em;
  margin-top: 1em;
  border-radius: .5em;
`;

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
  cursor: pointer;
`;

const TableHeader = styled(Row)`
  color: ${theme.text.light.hex};
  font-size: .95em;
  border: 0;
  padding-top: 0;
`;

const Cell = styled.li`
  display: inline-block;
  width: 33%;
`;

const CategoryChip = styled.span`
  padding: .3em .5em;
  border-radius: 2em;
`;



const generateTableFromUnits = (units: Unit[], generateRows: (u: Unit) => void) => (
  <Table>
    <TableHeader>
      <Cell>Name</Cell>
      <Cell>Price</Cell>
      <Cell>Unit</Cell>
      <Cell>Category</Cell>
      <Cell>Description</Cell>
    </TableHeader>
    {units.map(generateRows)}
  </Table>
);

export default class UnitDashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isBeingEdited: false,
      unit: null,
      selectedUnit: null
    };
  }

  // setEditingState = (isBeingEdited: boolean) => {
  //   this.setState({isBeingEdited});
  // }

  // displayAddButton = () => {
  //   if (this.state.isBeingEdited) {
  //     return null;
  //   }
  //   return (
  //     <GhostButton
  //       onClick={() => this.setEditingState(true)}
  //     >
  //       New Unit
  //     </GhostButton>
  //   );
  // }

  closeForm = () => {
    this.setState({
      isBeingEdited: false
    });
  }

  submitForm = (u: Partial<Unit>) => {
    this.props.createUnitType(u);
    this.closeForm();
  }

  editUnit = (u: Unit) => {
    this.setState({ selectedUnit: u.url });
  }

  closeSelectedUnit = () => {
    this.setState({ selectedUnit: null });
  }

  generateRowFromUnit = (unit: Unit) => {
    if (isEmpty(this.props.categories)) { return null; }
    const category = this.props.categories.find(c => c.url === unit.category) as Category;
    const catColor = new Color(category.color);
    return this.state.selectedUnit === unit.url
      ? (
        <EditUnitFormContainer
          key={unit.url}
          unit={unit}
          onCancel={this.closeSelectedUnit}
          onSave={this.closeSelectedUnit}
        />
      )
      : (
        <Row key={unit.url} onClick={() => this.editUnit(unit)}>
          <Cell>{unit.name}</Cell>
          <Cell>${beautifyNumber(Number(unit.unitPrice), 2)}</Cell>
          <Cell>{unit.unit}</Cell>
          <Cell>
            <CategoryChip style={{backgroundColor: catColor.toRgba(.2), color: catColor.hex}}>
              {category.name}
            </CategoryChip>
          </Cell>
          <Cell>{unit.description}</Cell>
        </Row>
      );
  }

  render = () => {
    return (
      <>
        <SectionTitle>Units</SectionTitle>
        <Container>
          <FormContainer
            shouldDisplay={this.state.isBeingEdited}
          >
            <UnitForm
              submitAction={this.submitForm}
              cancelAction={this.closeForm}
            />
            <HorizontalRule/>
          </FormContainer>
          {generateTableFromUnits(this.props.units, this.generateRowFromUnit)}
        </Container>
      </>
    );
  }
}
