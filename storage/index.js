import AsyncStorage from '@react-native-community/async-storage';
import mapStyle from './mapStyle';
import * as SETTINGS from './settings';
import { isString } from 'validators/src/validators.js';

export { mapStyle, SETTINGS };

const uuidv4 = require('uuid/v4');
const isStringValidator = isString();

export const getNextFeatureId = async () => {
  let counter = Number(await getSetting(SETTINGS.FID_COUNTER));
  counter += 1;
  await setSetting(SETTINGS.FID_COUNTER, counter.toString());
  return counter;
};

export const clearFeatureCounter = async () => {
  await setSetting(SETTINGS.FID_COUNTER, SETTINGS.FID_COUNTER.default);
};

export const resetToDefaults = async () => {
  await removeAllCollectedFeatures();
  const settings = getAllSettings();
  for (let i = 0; i < settings.length; i++) {
    await setSetting(settings[i].key, settings[i].default);
  }
};

export const checkSettingsInStore = async (reportValuesToConsole) => {
  try {
    const settings = getAllSettings();
    for (let i = 0; i < settings.length; i++) {
      const value = await getSetting(settings[i].key);
      if (value === null) {
        await setSetting(settings[i].key, settings[i].default);
      }
      if (reportValuesToConsole) {
        console.log(`${settings[i].key}: ${value}`);
      }
    }
  } catch (ex) {
    console.log(ex);
  }
};

export const getAllSettings = (onlyVisibleSettings) => {
  const result = Object.keys(SETTINGS).map((key) => SETTINGS[key]);
  return onlyVisibleSettings ? result.filter((s) => s.visible) : result;
};

export const getSetting = async (key) => {
  return await AsyncStorage.getItem(key.key || key);
};

export const setSetting = async (key, value) => {
  return await AsyncStorage.setItem(key.key || key, value);
};

export const getCollectedFeatures = async () => {
  const featuresString = await getSetting(SETTINGS.COLLECTED_FEATURES);
  return featuresString ? JSON.parse(featuresString) : [];
};

const setCollectedFeatures = async (features) => {
  return await setSetting(SETTINGS.COLLECTED_FEATURES, JSON.stringify(features));
};

export const createFeature = async (properties, geometry, featureType) => {
  const feature = { properties, geometry, featureType };
  feature.fid = uuidv4();
  feature.number = await getNextFeatureId();
  feature.createdDate = new Date().toLocaleString('bg-BG');
  return feature;
};

export const addCollectedFeature = async ({ properties, geometry, featureType }) => {
  const collectedFeature = await createFeature(properties, geometry, featureType);
  let features = await getCollectedFeatures();
  features.push(collectedFeature);
  await setCollectedFeatures(features);
  return collectedFeature;
};

export const removeCollectedFeature = async (featureOrFID) => {
  const fid = isStringValidator(featureOrFID) ? featureOrFID : featureOrFID.fid;
  const features = await getCollectedFeatures();
  const newFeatures = features.filter((i) => i.fid !== fid);
  await setCollectedFeatures(newFeatures);
  return featureOrFID;
};

export const removeAllCollectedFeatures = async () => {
  await clearFeatureCounter();
  await setCollectedFeatures([]);
};
