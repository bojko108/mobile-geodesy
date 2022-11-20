import { LatLng } from 'react-native-maps';
import {
    transformUTMToGeographic,
    projections,
    transformGeographicToLambert,
    transformLambertToGeographic,
    BGSCoordinates,
    transformGeographicToUTM,
} from 'transformations';
import { GeoCoordinate, Projection, TraceData } from '../types';

import { toDegrees, getDistance } from './math';

const bgsCoordinates = new BGSCoordinates();

/**
 * Calculates direction angle between two points in radians
 * @public
 * @param {!number[]} p1 - base point coordinates
 * @param {!number[]} p2 - target point coordinates
 * @return {number}
 */
export const getDirectionAngleInRadians = (p1, p2) => {
    const dx = p2[1] - p1[1],
        dy = p2[0] - p1[0];
    if (dy > 0 && dx > 0) return Math.atan(Math.abs(dx) / Math.abs(dy));
    if (dy < 0 && dx > 0) return Math.PI - Math.atan(Math.abs(dx) / Math.abs(dy));
    if (dy < 0 && dx < 0) return Math.PI + Math.atan(Math.abs(dx) / Math.abs(dy));
    if (dy > 0 && dx < 0) return 2 * Math.PI - Math.atan(Math.abs(dx) / Math.abs(dy));
    if (dy == 0 && dx > 0) return Math.PI / 2;
    if (dy < 0 && dx == 0) return Math.PI;
    if (dy == 0 && dx < 0) return (3 * Math.PI) / 2;
    if (dy > 0 && dx == 0) return 0;
    return 0;
};

/**
 * Calculates azimuth angle between two points in degrees
 * @public
 * @param {!number[]} p1 - base point coordinates
 * @param {!number[]} p2 - target point coordinates
 * @return {number}
 */
export const getDirectionAngle = (p1, p2) => {
    return toDegrees(getDirectionAngleInRadians(p1, p2));
};

/**
 * Calculates direction and distance for a target point
 * @param {!import('react-native-maps').LatLng} userLocation - user location
 * @param {!number[]} targetCoordinates - target point coordinates
 * @return {TraceData} Trace data
 */
export const trace = (userLocation, targetCoordinates) => {
    const base = transformGeographicToLambert([userLocation.latitude, userLocation.longitude]);
    const target = transformGeographicToLambert(targetCoordinates);

    return {
        dx: target[0] - base[0],
        dy: target[1] - base[1],
        distance: getDistance(base, target),
        direction: getDirectionAngle(base, target),
    };
};

/**
 * Transforms coordinates to WGS84 (4326)
 * @param {!number[]>} point 
 * @param {Projection} sourceCRS 
 * @returns {number[]}
 */
export const transformPointToWGS84 = (point, sourceCRS) => {
    let target = point;
    switch (sourceCRS) {
        case 'WGS84':
            break;
        case 'UTM34N':
            target = transformUTMToGeographic(point, projections.UTM34N);
            break;
        case 'UTM35N':
            target = transformUTMToGeographic(point, projections.UTM35N);
            break;
        case 'BGS_2005_KK':
            target = transformLambertToGeographic(point, projections.BGS_2005_KK);
            break;
        case 'BGS_SOFIA':
            target = bgsCoordinates.transform(point, projections.BGS_SOFIA, projections.BGS_2005_KK, false);
            target = transformLambertToGeographic(target, projections.BGS_2005_KK);
            break;
        case 'BGS_1930_24':
            target = bgsCoordinates.transform(point, projections.BGS_1930_24, projections.BGS_2005_KK, false);
            target = transformLambertToGeographic(target, projections.BGS_2005_KK);
            break;
        case 'BGS_1930_27':
            target = bgsCoordinates.transform(point, projections.BGS_1930_27, projections.BGS_2005_KK, false);
            target = transformLambertToGeographic(target, projections.BGS_2005_KK);
            break;
        case 'BGS_1950_3_24':
            target = bgsCoordinates.transform(point, projections.BGS_1950_3_24, projections.BGS_2005_KK, false);
            target = transformLambertToGeographic(target, projections.BGS_2005_KK);
            break;
        case 'BGS_1950_3_27':
            target = bgsCoordinates.transform(point, projections.BGS_1950_3_27, projections.BGS_2005_KK, false);
            target = transformLambertToGeographic(target, projections.BGS_2005_KK);
            break;
        case 'BGS_1950_6_21':
            target = bgsCoordinates.transform(point, projections.BGS_1950_6_21, projections.BGS_2005_KK, false);
            target = transformLambertToGeographic(target, projections.BGS_2005_KK);
            break;
        case 'BGS_1950_6_27':
            target = bgsCoordinates.transform(point, projections.BGS_1950_6_27, projections.BGS_2005_KK, false);
            target = transformLambertToGeographic(target, projections.BGS_2005_KK);
            break;
        case 'BGS_1970_K3':
            target = bgsCoordinates.transform(point, projections.BGS_1970_K3, projections.BGS_2005_KK, false);
            target = transformLambertToGeographic(target, projections.BGS_2005_KK);
            break;
        case 'BGS_1970_K5':
            target = bgsCoordinates.transform(point, projections.BGS_1970_K5, projections.BGS_2005_KK, false);
            target = transformLambertToGeographic(target, projections.BGS_2005_KK);
            break;
        case 'BGS_1970_K7':
            target = bgsCoordinates.transform(point, projections.BGS_1970_K7, projections.BGS_2005_KK, false);
            target = transformLambertToGeographic(target, projections.BGS_2005_KK);
            break;
        case 'BGS_1970_K9':
            target = bgsCoordinates.transform(point, projections.BGS_1970_K9, projections.BGS_2005_KK, false);
            target = transformLambertToGeographic(target, projections.BGS_2005_KK);
            break;
    }
    return target;
};

/**
 * Transforms coordinates from WGS84 (4326)
 * @param {!number[]} point 
 * @param {Projection} targetCRS 
 * @returns {number[]}
 */
export const transformPointFromWGS84 = (point, targetCRS) => {
    let target = point;
    switch (targetCRS) {
        case 'WGS84':
            break;
        case 'UTM34N':
            target = transformGeographicToUTM(point, projections.UTM34N);
            break;
        case 'UTM35N':
            target = transformGeographicToUTM(point, projections.UTM35N);
            break;
        case 'BGS_2005_KK':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            break;
        case 'BGS_SOFIA':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            target = bgsCoordinates.transform(target, projections.BGS_2005_KK, projections.BGS_SOFIA, false);
            break;
        case 'BGS_1930_24':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            target = bgsCoordinates.transform(target, projections.BGS_2005_KK, projections.BGS_1930_24, false);
            break;
        case 'BGS_1930_27':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            target = bgsCoordinates.transform(target, projections.BGS_2005_KK, projections.BGS_1930_27, false);
            break;
        case 'BGS_1950_3_24':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            target = bgsCoordinates.transform(target, projections.BGS_2005_KK, projections.BGS_1950_3_24, false);
            break;
        case 'BGS_1950_3_27':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            target = bgsCoordinates.transform(target, projections.BGS_2005_KK, projections.BGS_1950_3_27, false);
            break;
        case 'BGS_1950_6_21':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            target = bgsCoordinates.transform(target, projections.BGS_2005_KK, projections.BGS_1950_6_21, false);
            break;
        case 'BGS_1950_6_27':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            target = bgsCoordinates.transform(target, projections.BGS_2005_KK, projections.BGS_1950_6_27, false);
            break;
        case 'BGS_1970_K3':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            target = bgsCoordinates.transform(target, projections.BGS_2005_KK, projections.BGS_1970_K3, false);
            break;
        case 'BGS_1970_K5':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            target = bgsCoordinates.transform(target, projections.BGS_2005_KK, projections.BGS_1970_K5, false);
            break;
        case 'BGS_1970_K7':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            target = bgsCoordinates.transform(target, projections.BGS_2005_KK, projections.BGS_1970_K7, false);
            break;
        case 'BGS_1970_K9':
            target = transformGeographicToLambert(point, projections.BGS_2005_KK);
            target = bgsCoordinates.transform(target, projections.BGS_2005_KK, projections.BGS_1970_K9, false);
            break;
    }
    return target;
};