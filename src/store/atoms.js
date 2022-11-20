import { atom } from 'recoil';

/**
 * Stores the current basemap
 * - default: undefined
 * - type: string
 */
export const basemapState = atom({
  key: 'basemap',
  default: undefined,
});

/**
 * Stores the current user location - from the GPS
 * - default: undefined
 * - type: Expo.LocationObject
 */
export const userLocationState = atom({
  key: 'userLocation',
  default: undefined,
});

/**
 * Stores the current target for the trace task
 * - default: undefined
 */
export const targetState = atom({
  key: 'target',
  default: undefined,
});

export const featuresState = atom({
  key: 'features',
  default: [],
});
