import * as tasksActions from './bidTasksActions';
import categoriesActions from './bidCategoriesActions';
import itemsActions from './bidItemsActions';
import * as unitActions from './unitTypeActions';

const fetchBidComponents = () => {
  return (dispatch, getState) => {
    const bid = getState().bidData.currentBid;
    return Promise.all([
      dispatch(tasksActions.fetchBidTasks()),
      dispatch(unitActions.fetchUnitTypes()).then(() => dispatch(itemsActions.fetchBidItems())),
      dispatch(categoriesActions.fetchBidCategories()),
    ]);
  }
};

const bidComponentsActions = {
  fetchBidComponents
};

export default bidComponentsActions;
