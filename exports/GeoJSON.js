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

export const createFeatureCollection = features => {
  return Object.assign({}, { type: 'FeatureCollection', features });
};
