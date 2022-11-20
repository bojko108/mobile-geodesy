/**
 * @typedef SettingsItem
 * @property {string} key
 * @property {SettingsItemType} type
 * @property {string} title
 * @property {string} [description]
 * @property {boolean} [visible]
 * @property {boolean} [editable]
 * @property {any} [default]
 * @property {DomainItem[]} [options]
 */

/**
 * @typedef {'text' | 'number' | 'dropdown' | 'array'} SettingsItemType
 */

/**
 * @typedef FeatureBase
 * @property {string} featureType
 * @property {FeatureAttributes} properties
 * @property {GeoCoordinate} geometry
 */

/**
 * @typedef Feature
 * @property {string} fid
 * @property {number} number
 * @property {string} createdDate
 * @property {string} featureType
 * @property {FeatureAttributes} properties
 * @property {GeoCoordinate} geometry
 */

/**
 * @typedef {Object.<string, any>} FeatureAttributes
 */

/**
 * @typedef {'WGS84' | 'UTM34N' | 'UTM35N' | 'BGS_2005_KK' | 'BGS_SOFIA' | 'BGS_1930_24' | 'BGS_1930_27' | 'BGS_1950_3_24' | 'BGS_1950_3_27' | 'BGS_1950_6_21' | 'BGS_1950_6_27' | 'BGS_1970_K3' | 'BGS_1970_K5' | 'BGS_1970_K7' | 'BGS_1970_K9'} Projection
 */

/** 
 * @typedef DistanceExt - distance properties object
 * @property {number} distance
 * @property {number} initialBearing
 * @property {number} finalBearing
 * @property {number} iterations
 */

/**
 * @typedef TraceData - information about a traced point
 * @property {number} dx - delta x in meters
 * @property {number} dy - delta y in meters
 * @property {number} distance - distance in meters
 * @property {number} direction - direction angle in degrees
 */

/**
 * @typedef GeoCoordinate - object for storing Geographic coordinates
 * @property {number} latitude - Geographic Latitude in decimal degrees
 * @property {number} longitude - Geographic Longitude in decimal degrees
 */

/**
 * @typedef NECoordinate - Geodetic plane coordinates - Northing, Easting [, Elevation]
 * @property {number} northing - Northing in meters
 * @property {number} easting - Easting in meters
 * @property {number} [elevation] - Elevation in meters (optional)
 */

/**
 * @typedef xyCoordinate - coordinates - x, y [,z]
 * @property {number} x - Horizontal coordinate
 * @property {number} y - Vertical coordinate
 * @property {number} [z] - Third coordinate (optional)
 */

/**
 * @typedef FeatureTemplate
 * @property {string} name 
 * @property {string[]} relations 
 * @property {string} alias 
 * @property {Attribute[]} attributes 
 * @property {AutoCADLayerOptions} autocad 
 * @property {MapMarkerOptions} map 
 */

/**
 * @typedef DomainItem
 * @property {string} label 
 * @property {any} value
 * @property {any} [filter] - value used to filter domain values
 */

/**
 * @typedef Attribute
 * @property {string} name 
 * @property {string} alias
 * @property {boolean} required
 * @property {string} type
 * @property {any} [defaultValue]
 * @property {boolean} [editable]
 * @property {Validator[]} [validators]
 * @property {string} [errorText]
 * @property {string} [domain]
 * @property {number} [accuracy]
 * @property {number} [timeInteval]
 * @property {number} distanceInterval]
 * @property {number} [maxLength]
 * @property {string} [delimiter]
 * @property {string} [mask]
 */

/**
 * @typedef Validator
 * @property {string} name - name of the validator
 * @property {any} validValue - valid value for this validator
 * @property {string} errorMessage
 */

/**
 * @typedef AutoCADLayerOptions
 * @property {string} layerName
 * @property {string} blockName
 * @property {string[]} blockAttributes
 */
// lineColor
// lineType
// lineWidth


/**
 * @typedef MapMarkerOptions
 * @property {string} color
 * @property {string} [label]
 * @property {string} icon
 * @property {xyCoordinate} anchor
 */

/**
 * @typedef {Object.<string, DomainItem[]>} Domains
 */

/**
 * @typedef {Object.<string, AutoCADLayerOptions>} AutoCADLayers
 */