import { transformPointFromWGS84 } from '../calculations/geodesy';
import { createScriptFile, createDXFFile } from './AutoCAD';
import { createFeatureCollection, createPointFeature } from './GeoJSON';

/**
 * 
 * @param {Feature[]} inputFeatures 
 * @param {string} [targetCRS] default is 'WGS84'
 * @returns {string}
 */
export const writeAsDXF = (inputFeatures, targetCRS = 'WGS84') => {
    const features = transformFeatures(inputFeatures, targetCRS);
    return createDXFFile(features);
};

/**
 * 
 * @param {Feature[]} inputFeatures 
 * @param {string} [targetCRS] default is 'WGS84' 
 * @returns 
 */
export const writeAsScript = (inputFeatures, targetCRS = 'WGS84') => {
    const features = transformFeatures(inputFeatures, targetCRS);
    return createScriptFile(features);
};

/**
 * 
 * @param {Feature[]} inputFeatures 
 * @param {string} [targetCRS] default is 'WGS84' 
 * @returns 
 */
export const writeAsGeoJSON = (inputFeatures, targetCRS = 'WGS84') => {
    const features = transformFeatures(inputFeatures, targetCRS);
    for (let i = 0; i < features.length; i++) {
        features[i] = createPointFeature(features[i]);
    }
    return createFeatureCollection(features);
};

/**
 * 
 * @param {Feature[]} features 
 * @param {string} targetCRS 
 * @returns {Feature[]}
 */
const transformFeatures = (features, targetCRS) => {
    return features.map(feature => {
        const { latitude, longitude } = feature.geometry;
        const coords = transformPointFromWGS84([latitude, longitude], targetCRS);
        return Object.assign({}, {...feature, geometry: { latitude: coords[0], longitude: coords[1] } });
    });
};