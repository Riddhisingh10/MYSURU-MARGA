import { BusLiveLocation } from '@/types/bus';
import { MYSURU_ROUTES } from './routes';
import { interpolatePolyline } from '@/lib/geo';

export const INITIAL_BUSES: BusLiveLocation[] = [
  // Bus 1: On Route 119, approaching Palace
  (() => {
    const route = MYSURU_ROUTES.find((r) => r.id === 'route-119-up')!;
    const interp = interpolatePolyline(route.polylineCoordinates, 0.22);
    return {
      busId: 'KA-09-F-1191',
      routeId: 'route-119-up',
      routeNumber: '119',
      destination: 'Chamundi Hill Temple',
      currentCoordinates: interp.position,
      speedKmH: 26,
      headingDegrees: interp.heading,
      nextStopId: 'stop-palace',
      previousStopId: 'stop-suburban',
      currentPolylineIndex: interp.segmentIndex,
      progressPercent: 22,
      status: 'IN_TRANSIT',
      lastUpdatedTimestamp: Date.now(),
      source: 'simulated',
    };
  })(),

  // Bus 2: On Route 119, departing CBS (early route)
  (() => {
    const route = MYSURU_ROUTES.find((r) => r.id === 'route-119-up')!;
    const interp = interpolatePolyline(route.polylineCoordinates, 0.05);
    return {
      busId: 'KA-09-F-1192',
      routeId: 'route-119-up',
      routeNumber: '119',
      destination: 'Chamundi Hill Temple',
      currentCoordinates: interp.position,
      speedKmH: 22,
      headingDegrees: interp.heading,
      nextStopId: 'stop-suburban',
      previousStopId: 'stop-cbs',
      currentPolylineIndex: interp.segmentIndex,
      progressPercent: 5,
      status: 'IN_TRANSIT',
      lastUpdatedTimestamp: Date.now(),
      source: 'simulated',
    };
  })(),

  // Bus 3: On Route 201, near Saraswathipuram
  (() => {
    const route = MYSURU_ROUTES.find((r) => r.id === 'route-201-up')!;
    const interp = interpolatePolyline(route.polylineCoordinates, 0.35);
    return {
      busId: 'KA-09-F-2011',
      routeId: 'route-201-up',
      routeNumber: '201',
      destination: 'Bogadi 2nd Stage',
      currentCoordinates: interp.position,
      speedKmH: 25,
      headingDegrees: interp.heading,
      nextStopId: 'stop-ramaswamy',
      previousStopId: 'stop-saraswathipuram',
      currentPolylineIndex: interp.segmentIndex,
      progressPercent: 35,
      status: 'IN_TRANSIT',
      lastUpdatedTimestamp: Date.now(),
      source: 'simulated',
    };
  })(),

  // Bus 4: On Route 201, approaching Kuvempunagar Complex
  (() => {
    const route = MYSURU_ROUTES.find((r) => r.id === 'route-201-up')!;
    const interp = interpolatePolyline(route.polylineCoordinates, 0.72);
    return {
      busId: 'KA-09-F-2012',
      routeId: 'route-201-up',
      routeNumber: '201',
      destination: 'Bogadi 2nd Stage',
      currentCoordinates: interp.position,
      speedKmH: 20,
      headingDegrees: interp.heading,
      nextStopId: 'stop-kuvempunagar',
      previousStopId: 'stop-ballal',
      currentPolylineIndex: interp.segmentIndex,
      progressPercent: 72,
      status: 'APPROACHING',
      lastUpdatedTimestamp: Date.now(),
      source: 'simulated',
    };
  })(),

  // Bus 5: On Route 303, near Gokulam
  (() => {
    const route = MYSURU_ROUTES.find((r) => r.id === 'route-303-up')!;
    const interp = interpolatePolyline(route.polylineCoordinates, 0.42);
    return {
      busId: 'KA-09-F-3031',
      routeId: 'route-303-up',
      routeNumber: '303',
      destination: 'Vijayanagar 4th Stage',
      currentCoordinates: interp.position,
      speedKmH: 28,
      headingDegrees: interp.heading,
      nextStopId: 'stop-vijayanagar-water-tank',
      previousStopId: 'stop-gokulam',
      currentPolylineIndex: interp.segmentIndex,
      progressPercent: 42,
      status: 'IN_TRANSIT',
      lastUpdatedTimestamp: Date.now(),
      source: 'simulated',
    };
  })(),

  // Bus 6: On Route 10A, near Vontikoppal
  (() => {
    const route = MYSURU_ROUTES.find((r) => r.id === 'route-10A-up')!;
    const interp = interpolatePolyline(route.polylineCoordinates, 0.28);
    return {
      busId: 'KA-09-F-10A1',
      routeId: 'route-10A-up',
      routeNumber: '10A',
      destination: 'Infosys Mysore / Hebbal',
      currentCoordinates: interp.position,
      speedKmH: 27,
      headingDegrees: interp.heading,
      nextStopId: 'stop-vontikoppal',
      previousStopId: 'stop-cbs',
      currentPolylineIndex: interp.segmentIndex,
      progressPercent: 28,
      status: 'IN_TRANSIT',
      lastUpdatedTimestamp: Date.now(),
      source: 'simulated',
    };
  })(),

  // Bus 7: On Route 135, near Palace
  (() => {
    const route = MYSURU_ROUTES.find((r) => r.id === 'route-135-up')!;
    const interp = interpolatePolyline(route.polylineCoordinates, 0.38);
    return {
      busId: 'KA-09-F-1351',
      routeId: 'route-135-up',
      routeNumber: '135',
      destination: 'J.P. Nagar (Goblimara)',
      currentCoordinates: interp.position,
      speedKmH: 24,
      headingDegrees: interp.heading,
      nextStopId: 'stop-zoo',
      previousStopId: 'stop-palace',
      currentPolylineIndex: interp.segmentIndex,
      progressPercent: 38,
      status: 'IN_TRANSIT',
      lastUpdatedTimestamp: Date.now(),
      source: 'simulated',
    };
  })(),

  // Bus 8: On Route 62, between Ramaswamy & Ballal Circle
  (() => {
    const route = MYSURU_ROUTES.find((r) => r.id === 'route-62-up')!;
    const interp = interpolatePolyline(route.polylineCoordinates, 0.45);
    return {
      busId: 'KA-09-F-6201',
      routeId: 'route-62-up',
      routeNumber: '62',
      destination: 'Kuvempunagar Complex',
      currentCoordinates: interp.position,
      speedKmH: 25,
      headingDegrees: interp.heading,
      nextStopId: 'stop-ballal',
      previousStopId: 'stop-ramaswamy',
      currentPolylineIndex: interp.segmentIndex,
      progressPercent: 45,
      status: 'IN_TRANSIT',
      lastUpdatedTimestamp: Date.now(),
      source: 'simulated',
    };
  })(),
];
