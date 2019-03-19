import * as React from 'react';
import styled from 'styled-components';
import HorizontalRule from '@app/components/HorizontalRule';
import Table from '@taskItem/components/Table';
import PriceBreakdown from '@taskItem/components/PriceBreakdown';
import CategoryChip from '@taskItem/components/CategoryChip';
import Items from '@taskItem/components/Items';
import EditTaskFormContainer from '@taskItem/containers/EditTaskFormContainer';
import ActionHeader from '@app/components/ActionHeader';
import DangerActionModal from '@app/components/DangerActionModal';
import ModalContainer from '@app/containers/ModalContainer';
import { theme } from '@utils/color';
import { isEmpty, includes } from '@utils/utils';
import { StandardizedItem } from '@utils/conversions';
import { singularOrPlural } from '@utils/styling';
import { Category, BidTask } from '@app/types/types';

interface Props {
  items: StandardizedItem[];
  categories: Category[];
  selectedTask: BidTask;
  deleteTask: (taskUrl: string) => Promise<void>;
  unselectTask: () => void;
  showModal: (modalId: string) => void;
  hideModal: (modalId: string) => void;
}

interface State {
  selectedCategories: string[];
  items: StandardizedItem[];
}

const Container = styled.div``;

const ItemWrapper = styled.div`
  padding: 0 2em;
`;

const ChipContainer = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

const FilterTitle = styled.div`
  font-size: 1.2em;
  color: ${theme.text.dark.hex};
  padding-right: 1em;
`;

const FilterContainer = styled.div`
  display: flex;
  margin-top: 1em;
`;

const ModalDescription = styled.div`
  padding-bottom: 1em;
`;

const columns: {
  name: keyof StandardizedItem;
  style: 'text' | 'number' | 'currency' | 'default';
}[] = [
  {
    name: 'description',
    style: 'text'
  },
  {
    name: 'quantity',
    style: 'number'
  },
  {
    name: 'price',
    style: 'currency'
  },
  {
    name: 'total',
    style: 'currency'
  },
];

const cannotDeleteMessage = (subtasks: number) => (
  `The selected task has ${subtasks} ${singularOrPlural(subtasks, 'subtask')}
  and cannot be deleted. Please delete any subtasks first to delete this task.`
);

export default class TaskDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedCategories: this.props.categories.map(cat => cat.url),
      items: this.props.items
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.items.length !== prevProps.items.length) {
      this.setState(prevState => ({
        items: this.filterItems(prevState.selectedCategories)
      }));
    }
  }

  showConfirmModal = () => {
    this.props.showModal('deleteTaskModal');
  }

  hideConfirmModal = () => {
    this.props.hideModal('deleteTaskModal');
  }

  deleteTask = () => {
    this.props.deleteTask(this.props.selectedTask.url);
    this.hideConfirmModal();
  }

  filterItems(selectedCategories: string[]) {
    return this.props.items.filter(item => includes(selectedCategories, item.category));
  }

  selectCategory = (catUrl: string) => {
    let selectedCategories = includes(this.state.selectedCategories, catUrl)
      ? this.state.selectedCategories.filter(cat => cat !== catUrl)
      : [...this.state.selectedCategories, catUrl];
    this.setState({
      items: this.filterItems(selectedCategories),
      selectedCategories
    });
  }

  createTable() {
    if (isEmpty(this.props.items)) {
      return null;
    }
    return (
      <Table
        columns={columns}
        rows={this.state.items}
      />
    );
  }

  categoryFilters() {
    if (isEmpty(this.props.items)) {
      return null;
    }
    return (
      <FilterContainer>
        <FilterTitle>
          Category:
        </FilterTitle>
        <ChipContainer>
          {this.generateCategoryChips()}
        </ChipContainer>
      </FilterContainer>
    );
  }

  itemPriceBreakdown() {
    return this.state.items.reduce(
      (breakdown, row) => (
        {
          tax: breakdown.tax + row.tax,
          total: breakdown.total + row.total + row.tax + row.markup,
          markup: breakdown.markup + row.markup
        }
      ),
      {
        tax: 0,
        total: 0,
        markup: 0
      }
    );
  }

  generateCategoryChips() {
    let categoriesWithItems = this.props.categories.filter(category => (
      this.props.items.some(item => item.category === category.url)
    ));
    return categoriesWithItems.map(cat => (
      <CategoryChip
        key={cat.url}
        value={cat.name}
        color={cat.color}
        selected={includes(this.state.selectedCategories, cat.url)}
        onClick={() => this.selectCategory(cat.url)}
      />
    ));
  }

  modal = () => {
    if (isEmpty(this.props.selectedTask.children)) {
      return (
        <DangerActionModal
          showIf="deleteTaskModal"
          title="Delete selected task?"
          body="This action cannot be undone. The selected task and all of it's children will be deleted."
          confirmButtonLabel="Delete"
          onCloseCancel={false}
          cancelAction={this.hideConfirmModal}
          confirmAction={this.deleteTask}
        />
      );
    }
    return (
      <ModalContainer
        showIf="deleteTaskModal"
        title="Task can't be deleted"
        width="25em"
      >
        <div>
          <HorizontalRule/>
          <ModalDescription>
            {cannotDeleteMessage(this.props.selectedTask.children.length)}
          </ModalDescription>
        </div>
      </ModalContainer>
    );
  }

  render() {
    return (
      <Container>
        {this.modal()}
        <ActionHeader
          options={[
            {icon: 'clear', action: this.props.unselectTask},
            {icon: 'delete', danger: true, action: this.showConfirmModal},
            {icon: 'link'}
          ]}
        />
        <EditTaskFormContainer/>
        <ItemWrapper>
          <HorizontalRule />
          {this.categoryFilters()}
          <PriceBreakdown
            {...this.itemPriceBreakdown()}
          />
          <Items
            columns={columns}
            items={this.state.items}
            categories={this.props.categories}
          />
        </ItemWrapper>
      </Container>
    );
  }
}
