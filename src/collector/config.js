import { Domains, FeatureTemplate } from '../types';
import { getSetting, SETTINGS } from '../storage';
import { defaultFeatureTemplates, defaultDomains } from './defaultFeatureTemplate';

/**
 * @type {FeatureTemplate[]}
 */
let collectableFeatures = [];
/**
 * @type {Domains}
 */
let availableDomains = {};

export const fetchFeatureTemplatesAsync = async () => {
  try {
    const featureTemplatesUrl = await getSetting(SETTINGS.FEATURE_TEMPLATES_URL);

    const response = await fetch(featureTemplatesUrl);
    if (!response.ok) throw new Error(response.statusText);

    const { featureTemplates, domains } = await response.json();
    collectableFeatures = featureTemplates || defaultFeatureTemplates;
    availableDomains = domains || defaultDomains;
  } catch (err) {
    console.error(err);
    collectableFeatures = defaultFeatureTemplates;
    availableDomains = defaultDomains;
  }
};

/**
 *
 * @param { featureTemplates:FeatureTemplate[], domains:Domains } param
 */
export const setFeatureTemplates = ({ featureTemplates, domains }) => {
  collectableFeatures = featureTemplates || defaultFeatureTemplates;
  availableDomains = domains || defaultDomains;
};

/**
 *
 * @returns {FeatureTemplate[]} name and alias only
 */
export const getCollectableFeatures = () => collectableFeatures.map(({ name, alias }) => ({ name, alias }));

/**
 *
 * @param {string} featureType
 * @returns {FeatureTemplate | undefined}
 */
export const getConfigFor = (featureType) => collectableFeatures.find((i) => i.name === featureType);

/**
 *
 * @param {string} name
 * @returns {DomainItem[] | undefined}
 */
export const getDomain = (name) => availableDomains[name];

export const getAutoCADLayers = () => {
  let layers = {};
  collectableFeatures.forEach((i) => {
    if (i.autocad && i.autocad.layerName) {
      layers[i.name] = i.autocad.layerName;
    }
  });
  return layers;
};
