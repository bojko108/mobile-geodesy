import { getSetting, SETTINGS } from '../storage';
import { defaultFeatureTemplates, defaultDomains } from './defaultFeatureTemplates';

let collectableFeatures = [];
let availableDomains = {};

export const fetchFeatureTemplatesAsync = async () => {
  try {
    const featureTemplatesUrl = await getSetting(SETTINGS.FEATURE_TEMPLATES_URL);

    const response = await fetch(featureTemplatesUrl);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const { featureTemplates, domains } = await response.json();
    collectableFeatures = featureTemplates || defaultFeatureTemplates;
    availableDomains = domains || defaultDomains;
  } catch (err) {
    console.log(err);
    collectableFeatures = defaultFeatureTemplates;
    availableDomains = defaultDomains;
  }
};

export const setFeatureTemplates = ({ featureTemplates, domains }) => {
  collectableFeatures = featureTemplates || defaultFeatureTemplates;
  availableDomains = domains || defaultDomains;
};

export const getCollectableFeatures = () => {
  return collectableFeatures.map(({ name, alias }) => ({ name, alias }));
};

export const getConfigFor = (featureType) => {
  console.log(featureType);
  return collectableFeatures.find((i) => i.name === featureType);
};

export const getDomain = (name) => {
  return availableDomains[name];
};

export const getAutoCADLayers = () => {
  let layers = {};
  collectableFeatures.forEach((i) => {
    if (i.autocad && i.autocad.layerName) {
      layers[i.name] = i.autocad.layerName;
    }
  });
  return layers;
};
