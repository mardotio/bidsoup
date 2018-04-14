import tasksActions from './bidTasksActions';
import categoriesActions from './bidCategoriesActions';
import itemsActions from './bidItemsActions';

export const fetchBidComponents = bid => {
  return dispatch => Promise.all([
    dispatch(tasksActions.fetchBidTasks(bid)),
    dispatch(categoriesActions.fetchBidCategories(bid)),
    dispatch(itemsActions.fetchBidItems(bid))
  ]);
};

const bidComponentsActions = {
  fetchBidComponents
};

export default bidComponentsActions;
