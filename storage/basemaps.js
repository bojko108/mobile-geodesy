import { getSetting, SETTINGS } from '.';

const basemaps = [
  {
    label: 'BG Mountains',
    value: 'https://bgmtile.kade.si/{z}/{x}/{y}.png',
  },
  {
    label: 'Google Maps Satellite',
    value: 'mapType:satellite',
  },
  {
    label: 'Google Maps Standard (custom style)',
    value: 'mapType:standard',
  },
  {
    label: 'Google Maps Terrain',
    value: 'mapType:terrain',
  },
  {
    label: 'Google Maps Hybrid',
    value: 'mapType:hybrid',
  },
  {
    label: 'None',
    value: 'mapType:none',
  },
  {
    label: 'Open Cycle Map',
    value: 'https://a.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=a5ce9ce48b7d48238f1c691c4161f29c',
  },
  {
    label: 'OpenStreetMap France',
    value: 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  },
  {
    label: 'OpenStreetMap Standard',
    value: 'http://tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  {
    label: 'OpenTopoMap',
    value: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
  },
  {
    label: 'Wikimedia Map',
    value: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
  },
  {
    label: 'Wikimedia Hike Bike Map',
    value: 'http://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png',
  },
];

let localTilesets = [];

export const getBasemaps = (includingLocalTilesets = true) => {
  if (includingLocalTilesets) {
    return [...basemaps, ...localTilesets];
  }
  return [...basemaps];
};

export const fetchLocalTilesetsAsync = async () => {
  try {
    const localTilesetsUrl = await getSetting(SETTINGS.LOCAL_TILESETS_URL);
    const response = await fetch(localTilesetsUrl);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const result = await response.json();
    localTilesets = result.map(({ name, description, tilesetname, url }) => {
      let label = description || name;
      return { label: label || tilesetname, value: url };
    });
  } catch (err) {
    console.log(err);
  }
};
