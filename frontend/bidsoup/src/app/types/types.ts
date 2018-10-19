import { ApiState } from '../taskItem/reducers/apiReducer';
import { UiState } from '../reducers/uiReducer';
import { BidState } from '../bidSetup/reducers/bidReducer';
import { BidTaskState } from '../taskItem/reducers/bidTasksReducer';
import { UnitState } from '../taskItem/reducers/unitTypeReducer';

export interface Bid {
  url: string;
  key: number;
  name: string;
  description: string;
  bid_date: string;
  customer: string | null;
  tax_percent: string | null;
  biditems?: string;
  bidtasks?: string;
  categories?: string;
}

export interface Customer {
  url: string;
  name: string;
  email: string;
  phone: string;
}

export interface CustomerState {
  isFetching: boolean;
  list: Customer[];
  lastFetch: number | null;
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
  isFetching: boolean;
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
  isFetching: boolean;
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
  bids: BidState;
  customers: CustomerState;
  ui: UiState;
}
