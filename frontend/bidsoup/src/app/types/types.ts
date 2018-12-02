import { ApiState } from '../taskItem/reducers/apiReducer';
import { UiState } from '../reducers/uiReducer';
import { BidState } from '../dashboard/reducers/bidReducer';
import { BidTaskState } from '../taskItem/reducers/bidTasksReducer';
import { UnitState } from '../taskItem/reducers/unitTypeReducer';

export interface Bid {
  url: string;
  key: number;
  name: string;
  description: string;
  bidDate: string;
  customer: string | null;
  taxPercent: string | null;
  biditems?: string;
  bidtasks?: string;
  categories?: string;
}

export interface CrewMember {
  first: string;
  last: string;
  position: string;
  rate: number;
  color: string;
}

export interface Unit {
  url: string;
  name: string;
  description: string;
  unit: string;
  unitPrice: number;
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
    markupPercent: string;
    color: string;
  };
  lastFetch: number | null;
}
export interface BidItem {
  url: string;
  bid: string;
  unitType: string | null;
  price: string | number | null;
  description: string;
  notes: string;
  category: string;
  markupPercent: string;
  quantity: string | number;
  parent: string;
}

export interface BidItemState {
  isFetching: boolean;
  list: {
    url: string;
    bid: string;
    unitType: string | null;
    price: string | null;
    description: string;
    notes: string;
    category: string;
    markupPercent: string;
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
  account: string | null;
}
