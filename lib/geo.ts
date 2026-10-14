import { Coordinates } from '@/types/bus';

/**
 * Calculates Haversine distance between two coordinates in meters.
 */
export function getDistanceMeters(c1: Coordinates, c2: Coordinates): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(c2.lat - c1.lat);
  const dLng = toRad(c2.lng - c1.lng);
  const lat1 = toRad(c1.lat);
  const lat2 = toRad(c2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function getDistanceKm(c1: Coordinates, c2: Coordinates): number {
  return getDistanceMeters(c1, c2) / 1000;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculates compass heading/bearing from coord1 to coord2 in degrees (0 - 360).
 */
export function calculateHeading(from: Coordinates, to: Coordinates): number {
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const dLng = toRad(to.lng - from.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  let brng = toDeg(Math.atan2(y, x));
  brng = (brng + 360) % 360;
  return Math.round(brng);
}

/**
 * Estimates walking time in minutes based on distance in meters.
 * Assumes average walking speed of 4.5 km/h (~75 meters/minute) plus 1 min buffer.
 */
export function estimateWalkMinutes(distanceMeters: number): number {
  if (distanceMeters <= 50) return 1;
  const minutes = Math.ceil(distanceMeters / 75);
  return Math.max(1, minutes);
}

/**
 * Calculates total polyline length in meters.
 */
export function getPolylineLengthMeters(points: Coordinates[]): number {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += getDistanceMeters(points[i], points[i + 1]);
  }
  return total;
}

/**
 * Interpolates a coordinate along a polyline at a given progress percentage (0 to 1).
 */
export function interpolatePolyline(
  points: Coordinates[],
  progress: number
): { position: Coordinates; heading: number; segmentIndex: number } {
  if (points.length === 0) {
    return { position: { lat: 12.3051, lng: 76.6551 }, heading: 0, segmentIndex: 0 };
  }
  if (points.length === 1 || progress <= 0) {
    const heading = points.length > 1 ? calculateHeading(points[0], points[1]) : 0;
    return { position: points[0], heading, segmentIndex: 0 };
  }
  if (progress >= 1) {
    const last = points[points.length - 1];
    const prev = points[points.length - 2];
    const heading = calculateHeading(prev, last);
    return { position: last, heading, segmentIndex: points.length - 2 };
  }

  const totalLength = getPolylineLengthMeters(points);
  const targetDistance = totalLength * progress;

  let accumulated = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const segmentLength = getDistanceMeters(points[i], points[i + 1]);
    if (accumulated + segmentLength >= targetDistance) {
      const remaining = targetDistance - accumulated;
      const segmentFraction = segmentLength > 0 ? remaining / segmentLength : 0;
      const lat = points[i].lat + (points[i + 1].lat - points[i].lat) * segmentFraction;
      const lng = points[i].lng + (points[i + 1].lng - points[i].lng) * segmentFraction;
      const heading = calculateHeading(points[i], points[i + 1]);
      return { position: { lat, lng }, heading, segmentIndex: i };
    }
    accumulated += segmentLength;
  }

  const lastIdx = points.length - 1;
  return {
    position: points[lastIdx],
    heading: calculateHeading(points[lastIdx - 1], points[lastIdx]),
    segmentIndex: lastIdx - 1,
  };
}

/**
 * Finds the index of the closest point on a polyline to given coordinates.
 */
export function findClosestPointIndex(point: Coordinates, polyline: Coordinates[]): number {
  let minDistance = Infinity;
  let closestIndex = 0;

  for (let i = 0; i < polyline.length; i++) {
    const dist = getDistanceMeters(point, polyline[i]);
    if (dist < minDistance) {
      minDistance = dist;
      closestIndex = i;
    }
  }

  return closestIndex;
}

/**
 * Calculates remaining distance along polyline from current position to a target stop point.
 */
export function getRemainingDistanceToStop(
  currentPos: Coordinates,
  targetStopCoords: Coordinates,
  routePolyline: Coordinates[]
): number {
  const currentIdx = findClosestPointIndex(currentPos, routePolyline);
  const targetIdx = findClosestPointIndex(targetStopCoords, routePolyline);

  if (targetIdx <= currentIdx) {
    // Current position has passed or is right at the target stop
    return getDistanceMeters(currentPos, targetStopCoords);
  }

  // Distance from current position to next polyline vertex
  let distance = getDistanceMeters(currentPos, routePolyline[currentIdx + 1] || currentPos);

  // Sum intermediate vertices up to target index
  for (let i = currentIdx + 1; i < targetIdx; i++) {
    distance += getDistanceMeters(routePolyline[i], routePolyline[i + 1]);
  }

  // Vertex to target stop
  distance += getDistanceMeters(routePolyline[targetIdx], targetStopCoords);

  return distance;
}

/** Earth radius in kilometers */
export const EARTH_RADIUS_KM = 6371;

/** Average human walking speed in meters per minute */
export const WALKING_SPEED_METERS_PER_MIN = 75;

/** Checks if coordinate is within Mysuru metropolitan bounds */
export function isWithinMysuru(coords: { lat: number; lng: number }): boolean {
  return coords.lat >= 12.2 && coords.lat <= 12.4 && coords.lng >= 76.5 && coords.lng <= 76.8;
}
