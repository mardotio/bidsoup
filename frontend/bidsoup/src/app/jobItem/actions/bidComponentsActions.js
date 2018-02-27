import tasksActions from './bidTasksActions';
import categoriesActions from './bidCategoriesActions';
import itemsActions from './bidItemsActions';
import * as unitActions from './unitTypeActions';

const fetchBidComponents = bid => {
  return dispatch => Promise.all([
    dispatch(tasksActions.fetchBidTasks(bid)),
    dispatch(unitActions.fetchUnitTypes(bid)).then(() => dispatch(itemsActions.fetchBidItems(bid))),
    dispatch(categoriesActions.fetchBidCategories(bid)),
  ]);
};

const bidComponentsActions = {
  fetchBidComponents
};

export default bidComponentsActions;
