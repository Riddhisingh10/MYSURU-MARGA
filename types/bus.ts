/**
 * Core Data Models for Mysuru Marga
 * Smart City Bus Journey Planner & Real-Time Tracking Platform
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BusStop {
  id: string;
  name: string;
  kannadaName?: string;
  coordinates: Coordinates;
  landmark?: string;
  routesServing: string[]; // List of route IDs or numbers
  hasShelter?: boolean;
}

export interface RouteStopDetail {
  stopId: string;
  stopSequence: number;
  distanceFromStartKm: number;
  scheduledMinutesFromStart: number;
}

export interface BusRoute {
  id: string;
  routeNumber: string; // e.g. "119", "201", "303"
  routeName: string; // e.g. "City Bus Stand to Chamundi Hill"
  origin: string; // Stop ID or Stop Name
  destination: string; // Stop ID or Stop Name
  direction: 'UP' | 'DOWN';
  stops: RouteStopDetail[];
  orderedStopIds: string[];
  polylineCoordinates: Coordinates[]; // Plausible road-following coordinates
  approxDurationMinutes: number;
  frequencyMinutes: number;
  color?: string;
  isDemoRoute: boolean;
}

export type BusSimulationStatus = 'IN_TRANSIT' | 'AT_STOP' | 'APPROACHING' | 'TERMINATED' | 'PAUSED';

export interface BusLiveLocation {
  busId: string;
  routeId: string;
  routeNumber: string;
  destination: string;
  currentCoordinates: Coordinates;
  speedKmH: number;
  headingDegrees: number;
  nextStopId: string;
  previousStopId?: string;
  currentPolylineIndex: number; // Index along route geometry
  progressPercent: number; // 0 - 100% of route
  status: BusSimulationStatus;
  lastUpdatedTimestamp: number;
  source: 'simulated' | 'gps';
}

export interface ScheduleItem {
  routeId: string;
  stopId: string;
  departureTime: string; // "07:30 AM", "14:15"
  direction: 'UP' | 'DOWN';
  serviceDays: 'DAILY' | 'WEEKDAY' | 'WEEKEND';
}

export interface LocationSuggestion {
  id: string;
  name: string;
  description: string;
  coordinates: Coordinates;
  type: 'stop' | 'landmark' | 'user_location' | 'place';
  matchedStopId?: string;
}

export interface JourneyLeg {
  type: 'WALK_TO_STOP' | 'BUS_RIDE' | 'TRANSFER_WALK' | 'WALK_TO_DESTINATION';
  fromName: string;
  toName: string;
  fromCoords: Coordinates;
  toCoords: Coordinates;
  distanceMeters: number;
  durationMinutes: number;
  // Bus leg specific
  busRoute?: BusRoute;
  boardingStop?: BusStop;
  destinationStop?: BusStop;
  scheduledDepartureTime?: string;
  estimatedArrivalMinutes?: number; // Minutes from now until bus arrives at boarding stop
  stopsCount?: number;
  passedStopIds?: string[];
  busId?: string;
}

export interface JourneyOption {
  id: string;
  type: 'DIRECT' | 'ONE_TRANSFER';
  legs: JourneyLeg[];
  totalDurationMinutes: number;
  totalWalkingDistanceMeters: number;
  totalWalkingMinutes: number;
  totalBusMinutes: number;
  departureTimeText: string;
  arrivalTimeText: string;
  primaryRouteNumber: string;
  primaryDestination: string;
  boardingStop: BusStop;
  destinationStop: BusStop;
  transferStop?: BusStop;
  numberOfStops: number;
  estimatedArrivalAtBoardingMinutes: number;
  assignedBus?: BusLiveLocation;
}

export interface JourneySearchQuery {
  origin: LocationSuggestion;
  destination: LocationSuggestion;
  time?: Date;
  sortBy?: 'fastest' | 'least_walking' | 'fewest_transfers' | 'earliest';
}

export interface SimulationControlState {
  isRunning: boolean;
  speedMultiplier: number; // 1x, 2x, 5x
  fixedDemoClockMinutes: number; // Simulated time of day in minutes from midnight
}

/** Export Stop ID helper type */
export type StopIdentifier = string;

/** Direction indicator */
export type RouteDirection = "UP" | "DOWN";

/** Service day category */
export type ServiceDayPattern = "DAILY" | "WEEKDAY" | "WEEKEND";
