import { fetchBidTasks } from './actions_bid_tasks';
import { fetchBidCategories } from './actions_bid_categories';
import { fetchBidItems } from './actions_bid_items';

export const fetchBidComponents = bid => {
  return dispatch => Promise.all([
    dispatch(fetchBidTasks(bid)),
    dispatch(fetchBidCategories(bid)),
    dispatch(fetchBidItems(bid))
  ]);
};
