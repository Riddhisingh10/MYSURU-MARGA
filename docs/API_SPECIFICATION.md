# API Specification for Mysuru Marga

## Service Interfaces

### 1. `IBusLocationService`
- `getAllBuses(): Promise<BusLiveLocation[]>`
- `getBusById(busId: string): Promise<BusLiveLocation | null>`
- `getBusesByRoute(routeId: string): Promise<BusLiveLocation[]>`
- `subscribeToBusUpdates(callback: (buses: BusLiveLocation[]) => void): () => void`
- `calculateEtaToStop(busId: string, stopId: string): Promise<number>`

### 2. `IRouteService`
- `getAllRoutes(): Promise<BusRoute[]>`
- `getRouteById(routeId: string): Promise<BusRoute | null>`
- `searchRoutes(query: string): Promise<BusRoute[]>`
- `getRoutesServingStop(stopId: string): Promise<BusRoute[]>`
- `getAllStops(): Promise<BusStop[]>`
- `getStopById(stopId: string): Promise<BusStop | null>`

### 3. `IJourneyPlannerService`
- `findJourneys(query: JourneySearchQuery): Promise<JourneyOption[]>`
