import { selectorFamily } from 'recoil';
import { featuresState } from './atoms';

export const filteredFeatures = selectorFamily({
  key: 'filteredFeatures',
  get:
    (searchString) =>
    ({ get }) => {
      const features = get(featuresState);
      if (searchString) {
        return features.filter((f) =>
          Object.keys(f.properties).some((prop) => f.properties[prop].toString().toLowerCase().indexOf(searchString.toLowerCase()) > -1)
        );
      } else {
        return features;
      }
    },
});
