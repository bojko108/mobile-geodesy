import AsyncStorage from '@react-native-async-storage/async-storage';
import mapStyle from './mapStyle';
import * as SETTINGS from './settings';
import { isString } from 'validators/src/validators.js';
import { v4 as uuidv4 } from 'uuid';

export { mapStyle, SETTINGS };

const isStringValidator = isString();

/**
 * 
 * @returns {Promise<number>}
 */
export const getNextFeatureId = async() => {
    let counter = Number(await getSetting(SETTINGS.FID_COUNTER));
    counter += 1;
    await setSetting(SETTINGS.FID_COUNTER, counter.toString());
    return counter;
};

/**
 * 
 */
export const clearFeatureCounter = async() => {
    await setSetting(SETTINGS.FID_COUNTER, SETTINGS.FID_COUNTER.default);
};

/**
 * 
 */
export const resetToDefaults = async() => {
    await removeAllCollectedFeatures();
    const settings = getAllSettings();
    for (let i = 0; i < settings.length; i++) {
        await setSetting(settings[i].key, settings[i].default);
    }
};

/**
 * 
 * @param {boolean} [reportValuesToConsole]
 */
export const checkSettingsInStorage = async(reportValuesToConsole = false) => {
    try {
        const settings = getAllSettings();
        for (let i = 0; i < settings.length; i++) {
            const value = await getSetting(settings[i].key);
            if (value === null)
                await setSetting(settings[i].key, settings[i].default);
            if (reportValuesToConsole)
                console.info(`${settings[i].key}: ${value}`);
        }
    } catch (ex) {
        console.error(ex);
    }
};

/**
 * 
 * @param {boolean} [onlyVisibleSettings]
 * @returns {SettingsItem[]}
 */
export const getAllSettings = (onlyVisibleSettings = false) => {
    /**
     * @type {SettingsItem[]}
     */
    const result = Object.keys(SETTINGS).map(key => SETTINGS[key]);
    return onlyVisibleSettings ? result.filter((s) => s.visible) : result;
};

/**
 * 
 * @param {SettingsItem | string} key 
 * @returns {Promise<string | null>}
 */
export const getSetting = async(key) => {
    return await AsyncStorage.getItem(key.key || key);
};

/**
 * 
 * @param {SettingsItem | string} key 
 * @param {string | null} value 
 * @returns {Promise<void>}
 */
export const setSetting = async(key, value) => {
    return await AsyncStorage.setItem(key.key || key, value);
};

/**
 * 
 * @returns {Promise<Feature[]>}
 */
export const getCollectedFeatures = async() => {
    const featuresString = await getSetting(SETTINGS.COLLECTED_FEATURES);
    return featuresString ? JSON.parse(featuresString) : [];
};

/**
 * 
 * @param {Feature[]} features 
 * @returns 
 */
const setCollectedFeatures = async(features) => {
    return await setSetting(SETTINGS.COLLECTED_FEATURES, JSON.stringify(features));
};

/**
 * 
 * @param {FeatureAttributes} properties 
 * @param {GeoCoordinate} geometry 
 * @param {string} featureType 
 * @returns {Promise<Feature>}
 */
export const createFeature = async(properties, geometry, featureType) => {
    const fid = uuidv4();
    const number = await getNextFeatureId();
    const createdDate = new Date().toLocaleString('bg-BG');

    return {
        fid,
        number,
        createdDate,
        properties,
        geometry,
        featureType,
    };
};

/**
 * 
 * @param {FeatureBase} param
 * @returns {Promise<Feature>}
 */
export const addCollectedFeature = async({ properties, geometry, featureType }) => {
    /**
     * @type {Feature}
     */
    const collectedFeature = await createFeature(properties, geometry, featureType);
    /**
     * @type {Feature[]}
     */
    let features = await getCollectedFeatures();
    features.push(collectedFeature);
    await setCollectedFeatures(features);
    return collectedFeature;
};

/**
 * 
 * @param {Feature | string} featureOrFID 
 * @returns {Feature | string}
 */
export const removeCollectedFeature = async(featureOrFID) => {
    const fid = isStringValidator(featureOrFID) ? featureOrFID : featureOrFID.fid;
    const features = await getCollectedFeatures();
    const newFeatures = features.filter((i) => i.fid !== fid);
    await setCollectedFeatures(newFeatures);
    return featureOrFID;
};

/**
 * 
 */
export const removeAllCollectedFeatures = async() => {
    await clearFeatureCounter();
    await setCollectedFeatures([]);
};