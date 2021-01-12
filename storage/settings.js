export const EMAIL = {
  key: 'sc_email',
  title: 'Email',
  description: 'Exported files will be send to this email address',
  visible: true,
  editable: true,
  default: 'bojko108@gmail.com',
  type: 'text',
};

export const NOTIFY_DISTANCE = {
  key: 'sc_notify_distance',
  title: 'Notify distance',
  description: 'Specify the minimum distance in meters to the target POI for displaying notifications',
  visible: true,
  editable: true,
  default: '0',
  type: 'number',
};

export const DEFAULT_CRS = {
  key: 'sc_default_crs',
  title: 'Default coordinate system',
  description: 'Select default coordinate system used when exporting collected data or tracing POIs',
  visible: true,
  editable: true,
  default: 'WGS84',
  type: 'dropdown',
  options: [
    { label: 'Geographic coordinates', value: 'WGS84' },
    { label: 'UTM 34 North', value: 'UTM34N' },
    { label: 'UTM 35 North', value: 'UTM35N' },
    { label: 'BGS 2005 Cadastral coordinates', value: 'BGS_2005_KK' },
    { label: 'BGS Sofia', value: 'BGS_SOFIA' },
    { label: 'BGS 1930 (24 degrees)', value: 'BGS_1930_24' },
    { label: 'BGS 1930 (27 degrees)', value: 'BGS_1930_27' },
    { label: 'BGS 1950 3 degrees (24 degrees)', value: 'BGS_1950_3_24' },
    { label: 'BGS 1950 3 degrees (27 degrees)', value: 'BGS_1950_3_27' },
    { label: 'BGS 1950 6 degrees (21 degrees)', value: 'BGS_1950_6_21' },
    { label: 'BGS 1950 6 degrees (27 degrees)', value: 'BGS_1950_6_27' },
    { label: 'BGS 1970 (K3)', value: 'BGS_1970_K3' },
    { label: 'BGS 1970 (K5)', value: 'BGS_1970_K5' },
    { label: 'BGS 1970 (K7)', value: 'BGS_1970_K7' },
    { label: 'BGS 1970 (K9)', value: 'BGS_1970_K9' },
  ],
};

export const LOCAL_TILESETS_URL = {
  key: 'sc_local_tilesets_url',
  title: 'Local Tilesets',
  description: 'Sets the URL address of Mobile Tile Server App, which returns all available local tilesets  (requires restart).',
  visible: true,
  editable: true,
  default: 'http://localhost:1886/availabletilesets',
  type: 'text',
};

export const FEATURE_TEMPLATES_URL = {
  key: 'sc_feature_templates_url',
  title: 'Feature Templates URL',
  description:
    'Sets the URL address to a JSON file with feature templates. These templates contain all feature types and their attributes which can be collected using this app (requires restart).',
  visible: true,
  editable: true,
  default: 'http://localhost:1886/static/featureTemplates.json',
  type: 'text',
};

export const BASEMAP = {
  key: 'sc_basemap',
  title: 'Default Basemap',
  description: 'Select default basemap to be used (requires restart).',
  visible: true,
  editable: true,
  default: 'mapType:standard',
  type: 'text',
};

export const FILE_EXPORT_TYPE = {
  key: 'sc_export_type',
  title: 'Export Type',
  description: 'Type of exported file',
  visible: true,
  editable: true,
  default: 'dxf',
  type: 'dropdown',
  options: [
    { label: 'DXF', value: 'dxf' },
    { label: 'Script', value: 'script' },
    { label: 'GeoJSON', value: 'geojson' },
  ],
};

export const FID_COUNTER = {
  key: 'sc_fid',
  title: 'FID',
  description: 'Starts from 1 and increases for each collected feature',
  visible: false,
  editable: false,
  default: '0',
  type: 'text',
};

export const COLLECTED_FEATURES = {
  key: 'sc_features',
  title: 'Collected Features',
  description: 'Array of all collected features',
  visible: false,
  editable: false,
  default: '[]',
  type: 'array',
};
