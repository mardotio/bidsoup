import { ApiState } from '../taskItem/reducers/apiReducer';
import { UiState } from '../reducers/uiReducer';
import { BidState } from '../taskItem/reducers/bidReducer';
import { BidTaskState } from '../taskItem/reducers/bidTasksReducer';
import { UnitState } from '../taskItem/reducers/unitTypeReducer';

export interface Bid {
  url: string;
  name: string;
  description: string;
  bid_date: string;
  customer: string | null;
  tax_percent: string | null;
  biditems?: string;
  bidtasks?: string;
  categories?: string;
}

export interface BidTask {
  url: string;
  parent?: string;
  title: string;
  cost: number;
  description?: string;
  children: BidTask[];
}

export interface BidCategoryState {
  areFetching: boolean;
  list: {
    url: string;
    bid: string;
    name: string;
    description: string;
    markup_percent: string;
    color: string;
  };
  lastFetch: number | null;
}

export interface BidItemState {
  areFetching: boolean;
  list: {
    url: string;
    bid: string;
    unit_type: string | null;
    price: string | null;
    description: string;
    notes: string;
    category: string;
    markup_percent: string;
    quantity: string;
    parent: string;
  };
  lastFetch: number | null;
}

export interface BidComponentsState {
  bids: BidState;
  tasks: BidTaskState;
  categories: BidCategoryState;
  items: BidItemState;
  units: UnitState;
}

// Temporary interface which can be removed
// when all reducers return typed state.
export interface AppState {
  api: ApiState;
  bidData: BidComponentsState;
  ui: UiState;
}
