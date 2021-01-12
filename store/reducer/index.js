import { actionTypes } from '../actions';
import initialState from '../initialState';

export default function mainReducer(state = initialState, action) {
  let result = Object.assign({}, state);

  switch (action.type) {
    case actionTypes.CHANGE_BASEMAP:
      result.basemap = action.basemap;
    case actionTypes.TRACE_FEATURE:
      result.targetLocation = action.feature;
      break;
    case actionTypes.CLEAR_TRACE:
      result.targetLocation = undefined;
      break;
    case actionTypes.GET_FEATURES:
      result.collectedFeatures = action.collectedFeatures.slice(0);
      break;
    case actionTypes.ADD_FEATURE:
      result.collectedFeatures = [...result.collectedFeatures.filter((f) => f.fid !== action.feature.fid), Object.assign({}, action.feature)];
      break;
    case actionTypes.REMOVE_FEATURE:
      result.collectedFeatures = [...result.collectedFeatures.filter((f) => f.fid !== action.fid)];
      break;
    case actionTypes.REMOVE_ALL_FEATURES:
      result.collectedFeatures = [];
    default:
      break;
  }
  return result;
}
