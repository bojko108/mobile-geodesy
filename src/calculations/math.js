import { GeoCoordinate, DistanceExt } from '../types';

/**
 * WGS84 semi-major axis in meters - used as approximation of Earth's radius
 * @type {number}
 */
const WGS84_a = 6378137.0;
/**
 * WGS84 semi-minor axis in meters
 * @type {number}
 */
const WGS84_b = 6356752.3142;
/**
 * WGS84 inverse flattering (1/f)
 * @type {number}
 */
const WGS84_f = 1 / 298.257223563;

/**
 * Convert a value from radians to degrees.
 * @param {!number} radians - value in radians
 * @return {number}
 */
export const toDegrees = (radians) => {
    return radians * (180 / Math.PI);
};
/**
 * Conver a value from degrees to radians.
 * @param {!number} degrees - value in decimal degrees
 * @return {number}
 */
export const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

/**
 * Calculates the Eucledian distance between two points.
 * @param {!number[]} p1
 * @param {!number[]} p2
 * @return {number}
 */
export const getDistance = (p1, p2) => {
    const dx = p2[0] - p1[0],
        dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Convert distance from meters to decimal degrees
 * @public
 * @param {!number} meters - distance in meters
 * @param {number} [latitude=0] - current latitude, default is 0 - the equator
 * @return {number}
 */
export const metersToDegrees = (meters, latitude = 0) => {
    return meters / (111.32 * 1000 * Math.cos(toRadians(latitude)));
};

/**
 * Convert distance from decimal degrees to meters
 * @public
 * @param {!number} degrees - distance in decimal degrees
 * @param {number} [latitude=0] - latitude of the reference parallel, default is 0 - the equator
 * @return {number}
 */
export const degreesToMeters = (degrees, latitude = 0) => {
    return degrees * (111.32 * 1000 * Math.cos(toRadians(latitude)));
};

/**
 * Calculate bearing on sphere (WGS84 radius) between two points.
 * @param {!GeoCoordinate} start - geographic coordinate
 * @param {!GeoCoordinate} end - geographic coordinate
 * @return {number} - bearing in degrees
 */
export const bearingOnSphere = (start, end) => {
    const phi1 = toRadians(start.Latitude);
    const l1 = toRadians(start.Longitude);
    const phi2 = toRadians(end.Latitude);
    const l2 = toRadians(end.Longitude);

    const y = Math.sin(l2 - l1) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(l2 - l1);

    let angle = toDegrees(Math.atan2(y, x));
    //angle += 5;
    angle = (angle + 360) % 360;

    return angle;
};

/**
 * Calculate distance on Sphere (WGS84 radius). Uses equirectangular approximation. *
 * @param {!GeoCoordinate} start - geographic coordinate
 * @param {!GeoCoordinate} end - geographic coordinate
 * @return {number} distance in meters
 * @see https://www.movable-type.co.uk/scripts/latlong.html
 */
export const distanceOnSphere = (start, end) => {
    const phi1 = toRadians(start.Latitude);
    const l1 = toRadians(start.Longitude);
    const phi2 = toRadians(end.Latitude);
    const l2 = toRadians(end.Longitude);

    const x = (l2 - l1) * Math.cos((phi1 + phi2) / 2);
    const y = phi2 - phi1;

    return Math.sqrt(x * x + y * y) * WGS84_a;
};

/**
 * Calculates coordinates of target point by distance and bearing
 * @param {!GeoCoordinate} start - geographic coordinate
 * @param {!number} distance - distance in meters
 * @param {!number} bearing - bearing in degrees
 * @return {GeoCoordinate} geographic coordinates of the target point
 */
export const calculateOnSphere = (start, distance, bearing) => {
    const delta = Number(distance) / WGS84_a;
    const tita = toRadians(Number(bearing));

    const phi1 = toRadians(start.Latitude);
    const lam1 = toRadians(start.Longitude);

    const sinPhi1 = Math.sin(phi1),
        cosPhi1 = Math.cos(phi1);
    const sinDelta = Math.sin(delta),
        cosDelta = Math.cos(delta);
    const sinTita = Math.sin(tita),
        cosTita = Math.cos(tita);

    const sinPhi2 = sinPhi1 * cosDelta + cosPhi1 * sinDelta * cosTita;
    let phi2 = Math.asin(sinPhi2);
    const y = sinTita * sinDelta * cosPhi1;
    const x = cosDelta - sinPhi1 * sinPhi2;
    let lam2 = lam1 + Math.atan2(y, x);

    return {
        Latitude: ((toDegrees(lam2) + 540) % 360) - 180,
        Longitude: toDegrees(phi2),
    };
};

/**
 * Calculates the geodetic distance between two points using the Vincenty inverse formula for ellipsoids.
 *
 * Taken from http://movable-type.co.uk/scripts/latlong-vincenty.html and optimized / cleaned up
 * by Mathias Bynens <http://mathiasbynens.be/>
 * Based on the Vincenty direct formula by T. Vincenty, “Direct and Inverse Solutions of Geodesics
 * on the Ellipsoid with application of nested equations”, Survey Review, vol XXII no 176, 1975
 * <http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf>
 *
 * @param {!GeoCoordinate} start - first point coordinates
 * @param {!GeoCoordinate} end - end point coordinates
 * @return {DistanceExt} result
 */
export const distanceBearingOnEllipsoid = (start, end) => {
    const p1 = start,
        p2 = end;
    if (p1.Longitude == -180) p1.Longitude = 180;
    const phi1 = toRadians(p1.Latitude),
        lamb1 = toRadians(p1.Latitude);
    const phi2 = toRadians(p2.Latitude),
        lamb2 = toRadians(p2.Longitude);

    const a = WGS84_a,
        b = WGS84_b,
        f = WGS84_f;

    const L = lamb2 - lamb1;
    const tanU1 = (1 - f) * Math.tan(phi1),
        cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1),
        sinU1 = tanU1 * cosU1;
    const tanU2 = (1 - f) * Math.tan(phi2),
        cosU2 = 1 / Math.sqrt(1 + tanU2 * tanU2),
        sinU2 = tanU2 * cosU2;

    let sinLamb,
        cosLamb,
        sinSqsigma,
        sinsigma = 0,
        cossigma = 0,
        sigma = 0,
        sinalpha,
        cosSqalpha = 0,
        cos2sigmaM = 0,
        C;

    let lambda = L,
        lambdaPrim,
        iterations = 0,
        antimeridian = Math.abs(L) > Math.PI;
    do {
        sinLamb = Math.sin(lambda);
        cosLamb = Math.cos(lambda);
        sinSqsigma = cosU2 * sinLamb * (cosU2 * sinLamb) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLamb) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLamb);
        if (sinSqsigma == 0) break; // co-incident points
        sinsigma = Math.sqrt(sinSqsigma);
        cossigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLamb;
        sigma = Math.atan2(sinsigma, cossigma);
        sinalpha = (cosU1 * cosU2 * sinLamb) / sinsigma;
        cosSqalpha = 1 - sinalpha * sinalpha;
        cos2sigmaM = cosSqalpha != 0 ? cossigma - (2 * sinU1 * sinU2) / cosSqalpha : 0; // equatorial line: cosSqalpha=0 (§6)
        C = (f / 16) * cosSqalpha * (4 + f * (4 - 3 * cosSqalpha));
        lambdaPrim = lambda;
        lambda = L + (1 - C) * f * sinalpha * (sigma + C * sinsigma * (cos2sigmaM + C * cossigma * (-1 + 2 * cos2sigmaM * cos2sigmaM)));
        var iterationCheck = antimeridian ? Math.abs(lambda) - Math.PI : Math.abs(lambda);
        if (iterationCheck > Math.PI) throw new Error('lambda > π');
    } while (Math.abs(lambda - lambdaPrim) > 1e-12 && ++iterations < 1000);
    if (iterations >= 1000) throw new Error('Formula failed to converge');

    const uSq = (cosSqalpha * (a * a - b * b)) / (b * b);
    const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    const deltaSigma =
        B *
        sinsigma *
        (cos2sigmaM +
            (B / 4) *
            (cossigma * (-1 + 2 * cos2sigmaM * cos2sigmaM) - (B / 6) * cos2sigmaM * (-3 + 4 * sinsigma * sinsigma) * (-3 + 4 * cos2sigmaM * cos2sigmaM)));

    const s = b * A * (sigma - deltaSigma);

    let alpha1 = Math.atan2(cosU2 * sinLamb, cosU1 * sinU2 - sinU1 * cosU2 * cosLamb);
    let alpha2 = Math.atan2(cosU1 * sinLamb, -sinU1 * cosU2 + cosU1 * sinU2 * cosLamb);

    alpha1 = (alpha1 + 2 * Math.PI) % (2 * Math.PI); // normalise to 0..360
    alpha2 = (alpha2 + 2 * Math.PI) % (2 * Math.PI); // normalise to 0..360

    return {
        distance: s,
        initialBearing: s == 0 ? NaN : toDegrees(alpha1),
        finalBearing: s == 0 ? NaN : toDegrees(alpha2),
        iterations: iterations,
    };
};

/**
 * Calculates the geodetic distance between two points using the Vincenty inverse formula for ellipsoids.
 *
 * Taken from http://movable-type.co.uk/scripts/latlong-vincenty.html and optimized / cleaned up
 * by Mathias Bynens <http://mathiasbynens.be/>
 * Based on the Vincenty direct formula by T. Vincenty, “Direct and Inverse Solutions of Geodesics
 * on the Ellipsoid with application of nested equations”, Survey Review, vol XXII no 176, 1975
 * <http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf>
 *
 * @param {!GeoCoordinate} start - first point coordinates
 * @param {!GeoCoordinate} end - end point coordinates
 * @return {number} distance in meters
 */
export const distanceOnEllipsoid = (start, end) => {
    const result = distanceBearingOnEllipsoid(start, end);
    return result.distance;
};

/**
 * Calculates the destination point given start point latitude / longitude (numeric degrees),
 * bearing (numeric degrees) and distance (in m).
 *
 * Taken from http://movable-type.co.uk/scripts/latlong-vincenty-direct.html and
 * optimized / cleaned up by Mathias Bynens <http://mathiasbynens.be/>
 * Based on the Vincenty direct formula by T. Vincenty, “Direct and Inverse Solutions
 * of Geodesics on the Ellipsoid with application of nested equations”, Survey Review,
 * vol XXII no 176, 1975 <http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf>
 *
 * @param {!GeoCoordinate} start - lon, lat coordinates
 * @param {!number} distance - distance in meters
 * @param {!number} bearing - bearing in degrees
 * @return {GeoCoordinate} coordinates of target point in lon, lat
 */
export const calculateOnEllipsoid = (start, distance, bearing) => {
    let a = WGS84_a,
        b = WGS84_b,
        f = WGS84_f,
        s = distance,
        alpha1 = toRadians(bearing),
        sinAlpha1 = Math.sin(alpha1),
        cosAlpha1 = Math.cos(alpha1),
        tanU1 = (1 - f) * Math.tan(toRadians(start.Latitude)),
        cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1),
        sinU1 = tanU1 * cosU1,
        sigma1 = Math.atan2(tanU1, cosAlpha1),
        sinAlpha = cosU1 * sinAlpha1,
        cosSqAlpha = 1 - sinAlpha * sinAlpha,
        uSq = (cosSqAlpha * (a * a - b * b)) / (b * b),
        A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
        B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
        sigma = s / (b * A),
        sinSigma = Math.sin(sigma),
        cosSigma = Math.cos(sigma),
        cos2SigmaM = Math.cos(2 * sigma1 + sigma),
        deltaSigma,
        sigmaP = 2 * Math.PI;
    while (Math.abs(sigma - sigmaP) > 1e-12) {
        cos2SigmaM = Math.cos(2 * sigma1 + sigma);
        deltaSigma =
            B *
            sinSigma *
            (cos2SigmaM +
                (B / 4) *
                (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
                    (B / 6) * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
        sigmaP = sigma;
        sigma = s / (b * A) + deltaSigma;
        sinSigma = Math.sin(sigma);
        cosSigma = Math.cos(sigma);
    }
    let tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1,
        lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)),
        lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1),
        C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha)),
        L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM))); // final bearing

    return {
        Latitude: start.Latitude + toDegrees(L),
        Longitude: toDegrees(lat2),
    };
};