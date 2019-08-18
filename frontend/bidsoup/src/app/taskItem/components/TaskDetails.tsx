import * as React from 'react';
import styled from 'styled-components';
import HorizontalRule from '@app/components/HorizontalRule';
import PriceBreakdown from '@taskItem/components/PriceBreakdown';
import CategoryChip from '@taskItem/components/CategoryChip';
import Items from '@taskItem/components/Items';
import EditTaskFormContainer from '@taskItem/containers/EditTaskFormContainer';
import DangerActionModal from '@app/components/DangerActionModal';
import ModalContainer from '@app/containers/ModalContainer';
import ChildTasks from '@taskItem/components/ChildTasks';
import { Color, theme } from '@utils/color';
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
  goToTask: (taskUuid: string) => void;
}

interface State {
  selectedCategories: string[];
}

const Container = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.components.scrollbar.hex};
  }
`;

const ChipContainer = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

const FilterContainer = styled.div`
  display: flex;
  margin-top: 1em;
  background-color: ${Color.shade(0).hex};
  padding: 1em;
`;

const ModalDescription = styled.div`
  padding-bottom: 1em;
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

const cannotDeleteMessage = (subtasks: number) => (
  `The selected task has ${subtasks} ${singularOrPlural(subtasks, 'subtask')}
  and cannot be deleted. Please delete any subtasks first to delete this task.`
);

export default class TaskDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedCategories: this.props.categories.map(cat => cat.url),
    };
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
      selectedCategories
    });
  }

  categoryFilters() {
    if (isEmpty(this.props.items)) {
      return null;
    }
    return (
      <FilterContainer>
        <ChipContainer>
          {this.generateCategoryChips()}
        </ChipContainer>
      </FilterContainer>
    );
  }

  itemPriceBreakdown(items: StandardizedItem[]) {
    return items.reduce(
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
          confirmButtonLabel="Yes, Delete"
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
    const filteredItems = this.filterItems(this.state.selectedCategories);
    return (
      <Container>
        {this.modal()}
        <EditTaskFormContainer/>
        <div>
          <SectionTitle>Filters</SectionTitle>
          {this.categoryFilters()}
        </div>
        <PriceBreakdown
          {...this.itemPriceBreakdown(filteredItems)}
        />
        <ChildTasks
          tasks={this.props.selectedTask.children}
          parent={this.props.selectedTask.url}
          goToTask={this.props.goToTask}
        />
        <Items
          items={filteredItems}
          categories={this.props.categories}
        />
      </Container>
    );
  }
}
