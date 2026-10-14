import {
  BusStop,
  BusRoute,
  BusLiveLocation,
  ScheduleItem,
  LocationSuggestion,
  JourneyOption,
  JourneySearchQuery,
  Coordinates,
} from '@/types/bus';

/**
 * Service Contract for Bus Live Locations & Simulation.
 * Designed so MockBusLocationService can be swapped with RealTimeGpsBusLocationService
 * (e.g. WebSocket / Server-Sent Events / REST API) without modifying UI components.
 */
export interface IBusLocationService {
  /**
   * Retrieves all currently active buses.
   */
  getAllBuses(): Promise<BusLiveLocation[]>;

  /**
   * Retrieves live location of a specific bus.
   */
  getBusById(busId: string): Promise<BusLiveLocation | null>;

  /**
   * Retrieves all buses currently operating on a given route.
   */
  getBusesByRoute(routeId: string): Promise<BusLiveLocation[]>;

  /**
   * Subscribes to live location updates for all buses or a specific bus.
   * Returns an unsubscribe callback.
   */
  subscribeToBusUpdates(
    callback: (buses: BusLiveLocation[]) => void,
    filterBusId?: string
  ): () => void;

  /**
   * Calculates ETA in minutes from a bus's current location to a given stop.
   */
  calculateEtaToStop(busId: string, stopId: string): Promise<number>;

  // Demo Simulation Controls (only active in mock service)
  isSimulationRunning(): boolean;
  setSimulationRunning(running: boolean): void;
  getSpeedMultiplier(): number;
  setSpeedMultiplier(multiplier: number): void;
}

/**
 * Service Contract for Bus Routes.
 */
export interface IRouteService {
  getAllRoutes(): Promise<BusRoute[]>;
  getRouteById(routeId: string): Promise<BusRoute | null>;
  searchRoutes(query: string): Promise<BusRoute[]>;
  getRoutesServingStop(stopId: string): Promise<BusRoute[]>;
  getAllStops(): Promise<BusStop[]>;
  getStopById(stopId: string): Promise<BusStop | null>;
}

/**
 * Service Contract for Bus Timetables & Schedules.
 */
export interface IScheduleService {
  getSchedulesForRoute(routeId: string): Promise<ScheduleItem[]>;
  getNextScheduledDeparture(routeId: string, stopId: string, afterTime?: Date): Promise<string | null>;
}

/**
 * Service Contract for Geocoding and Place Suggestions.
 */
export interface ILocationSearchService {
  searchLocations(query: string): Promise<LocationSuggestion[]>;
  getNearbyStops(coords: Coordinates, radiusMeters?: number): Promise<BusStop[]>;
  getPopularDestinations(): LocationSuggestion[];
  getCurrentPosition(): Promise<Coordinates>;
}

/**
 * Service Contract for Journey Planning & Multimodal Routing.
 */
export interface IJourneyPlannerService {
  findJourneys(query: JourneySearchQuery): Promise<JourneyOption[]>;
}
