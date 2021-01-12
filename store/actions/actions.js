import { CHANGE_BASEMAP, TRACE_FEATURE, CLEAR_TRACE, ADD_FEATURE, REMOVE_FEATURE, REMOVE_ALL_FEATURES, GET_FEATURES } from './actionTypes';
import {
  getCollectedFeatures,
  addCollectedFeature,
  removeCollectedFeature,
  removeAllCollectedFeatures,
  createFeature,
  setSetting,
  SETTINGS,
} from '../../storage';

export function changeBasemapTask(basemap) {
  return { type: CHANGE_BASEMAP, basemap };
}
export function changeBasemap(basemap) {
  console.log('in change basemap: ' + basemap);
  setSetting(SETTINGS.BASEMAP, basemap);
  return changeBasemapTask(basemap);
}

export function traceFeatureTask(feature) {
  return { type: TRACE_FEATURE, feature };
}
export function clearTraceTask() {
  return { type: CLEAR_TRACE };
}
export function clearTrace() {
  return clearTraceTask();
}

export function traceFeature(geometry) {
  return async (dispatch) => {
    const feature = await createFeature({}, geometry);
    dispatch(traceFeatureTask(feature));
  };
}

export function getFeaturesTask(collectedFeatures) {
  return { type: GET_FEATURES, collectedFeatures };
}
export function addFeatureTask(feature) {
  return { type: ADD_FEATURE, feature };
}
export function removeFeatureTask(fid) {
  return { type: REMOVE_FEATURE, fid };
}
export function removeAllFeaturesTask() {
  return { type: REMOVE_ALL_FEATURES };
}
export function getFeatures() {
  return async (dispatch) => {
    const collectedFeatures = await getCollectedFeatures();
    dispatch(getFeaturesTask(collectedFeatures));
  };
}
export function addFeature(feature) {
  return async (dispatch) => {
    const collectedFeature = await addCollectedFeature(feature);
    dispatch(addFeatureTask(collectedFeature));
  };
}
export function removeFeature(fid) {
  return async (dispatch) => {
    await removeCollectedFeature(fid);
    dispatch(removeFeatureTask(fid));
  };
}
export function removeAllFeatures() {
  return async (dispatch) => {
    await removeAllCollectedFeatures();
    dispatch(removeAllFeaturesTask());
  };
}
