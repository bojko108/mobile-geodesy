/**
 * 
 * @param {Feature} feature 
 * @returns {Object<string,any>}
 */
export const createPointFeature = feature => {
    const { latitude, longitude } = feature.geometry;
    const geometry = { coordinates: [longitude, latitude], type: 'Point' };
    let properties = Object.assign({}, feature.properties);
    properties.number = feature.number;
    properties.featureType = feature.featureType;
    properties.createdDate = feature.createdDate;
    properties.fid = feature.fid;

    return Object.assign({}, { type: 'Feature' }, { geometry, properties });
};

/**
 * 
 * @param {Feature[]} features 
 * @returns {Object<string,any}
 */
export const createFeatureCollection = features => {
    return Object.assign({}, { type: 'FeatureCollection', features });
};