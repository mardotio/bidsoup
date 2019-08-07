import { AccountState } from '@app/reducers/accountReducer';
import { ApiState } from '@taskItem/reducers/apiReducer';
import { BidState } from '@dashboard/reducers/bidReducer';
import { BidTaskState } from '@taskItem/reducers/bidTasksReducer';
import { LoginState } from '../login/reducers/loginReducer';
import { UiState } from '@app/reducers/uiReducer';
import { UnitState } from '@taskItem/reducers/unitTypeReducer';
import { BidItemsState } from '@app/taskItem/reducers/bidItemsReducer';
import { UserAccountState } from '@app/reducers/userAccountReducer';
import { UnitOptionsState } from '@app/reducers/unitOptionsReducer';

export interface Account {
  bids: string;
  name: string;
  slug: string;
  url: string;
}

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Bid {
  url: string;
  key: number;
  name: string;
  description: string | null;
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
  unitPrice: number | string;
  category: string;
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

export interface Category {
  url: string;
  bid: string;
  name: string;
  description: string;
  markupPercent: string;
  color: string;
  taxable: boolean;
}

export interface BidCategoryState {
  isFetching: boolean;
  list: Category[];
  lastFetch: number | null;
}

export interface BidItem {
  url: string;
  bid: string;
  unitType: string | null;
  price: string | number | null;
  description: string;
  notes: string | null;
  category: string;
  markupPercent: string | null;
  quantity: string | number;
  parent: string;
}

export interface BidComponentsState {
  tasks: BidTaskState;
  categories: BidCategoryState;
  items: BidItemsState;
  units: UnitState;
}

// Temporary interface which can be removed
// when all reducers return typed state.
export interface AppState {
  account: AccountState;
  api: ApiState;
  bidData: BidComponentsState;
  bids: BidState;
  customers: CustomerState;
  login: LoginState;
  ui: UiState;
  unitOptions: UnitOptionsState;
  user: UserAccountState;
}
