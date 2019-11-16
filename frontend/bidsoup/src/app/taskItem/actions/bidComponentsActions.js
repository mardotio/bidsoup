import * as tasksActions from '@taskItem/actions/bidTasksActions';
import categoriesActions from './bidCategoriesActions';
import { fetchBidItems } from './bidItemsActions';
import * as unitActions from '@taskItem/actions/unitTypeActions';

const fetchBidComponents = () => {
  return (dispatch, getState) => {
    return Promise.all([
      dispatch(tasksActions.fetchBidTasks()),
      dispatch(unitActions.fetchUnitTypes()),
      dispatch(fetchBidItems()),
      dispatch(categoriesActions.fetchBidCategories()),
    ]);
  }
};

const bidComponentsActions = {
  fetchBidComponents
};

export default bidComponentsActions;
