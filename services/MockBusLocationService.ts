import { BusLiveLocation, BusSimulationStatus } from '@/types/bus';
import { IBusLocationService } from './types';
import { INITIAL_BUSES } from '@/data/buses';
import { MYSURU_ROUTES } from '@/data/routes';
import { MYSURU_STOPS } from '@/data/stops';
import {
  interpolatePolyline,
  getDistanceMeters,
  getRemainingDistanceToStop,
} from '@/lib/geo';
import { SIMULATION_CONFIG } from '@/lib/constants';

type BusUpdateListener = (buses: BusLiveLocation[]) => void;

export class MockBusLocationService implements IBusLocationService {
  private buses: BusLiveLocation[] = [];
  private listeners: Set<{ id: string; callback: BusUpdateListener; filterBusId?: string }> =
    new Set();
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = true;
  private speedMultiplier: number = SIMULATION_CONFIG.defaultSpeedMultiplier;

  constructor() {
    // Deep clone initial buses so state is isolated
    this.buses = JSON.parse(JSON.stringify(INITIAL_BUSES));
    if (typeof window !== 'undefined') {
      this.startSimulationLoop();
    }
  }

  private startSimulationLoop() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      if (!this.isRunning) return;
      this.tick();
    }, SIMULATION_CONFIG.updateIntervalMs);
  }

  private tick() {
    const now = Date.now();

    this.buses = this.buses.map((bus) => {
      const route = MYSURU_ROUTES.find((r) => r.id === bus.routeId);
      if (!route || route.polylineCoordinates.length < 2) return bus;

      // Base progress step: roughly 1 complete route in ~ 25 min at 1x
      // With speedMultiplier, moves proportionately faster for demo purposes
      const stepIncrement = (0.0035 * this.speedMultiplier);
      let newProgress = (bus.progressPercent / 100) + stepIncrement;

      // Wrap around loop when route finishes
      if (newProgress >= 1.0) {
        newProgress = 0.01;
      }

      const interp = interpolatePolyline(route.polylineCoordinates, newProgress);

      // Derive previous and next stop based on progress along ordered stops
      const { previousStopId, nextStopId, status } = this.deriveStopProgression(
        interp.position,
        route.orderedStopIds
      );

      return {
        ...bus,
        currentCoordinates: interp.position,
        headingDegrees: interp.heading,
        currentPolylineIndex: interp.segmentIndex,
        progressPercent: Math.round(newProgress * 100),
        previousStopId,
        nextStopId,
        status,
        lastUpdatedTimestamp: now,
      };
    });

    this.notifyListeners();
  }

  private deriveStopProgression(
    busCoords: { lat: number; lng: number },
    orderedStopIds: string[]
  ): { previousStopId: string; nextStopId: string; status: BusSimulationStatus } {
    let closestStopId = orderedStopIds[0];
    let closestDistance = Infinity;
    let closestIndex = 0;

    orderedStopIds.forEach((stopId, idx) => {
      const stop = MYSURU_STOPS.find((s) => s.id === stopId);
      if (stop) {
        const dist = getDistanceMeters(busCoords, stop.coordinates);
        if (dist < closestDistance) {
          closestDistance = dist;
          closestStopId = stopId;
          closestIndex = idx;
        }
      }
    });

    // If bus is within 70 meters of a stop, it is considered AT_STOP
    let status: BusSimulationStatus = 'IN_TRANSIT';
    if (closestDistance <= 70) {
      status = 'AT_STOP';
    } else if (closestDistance <= 250) {
      status = 'APPROACHING';
    }

    const prevIndex = Math.max(0, closestIndex - 1);
    const nextIndex = Math.min(orderedStopIds.length - 1, closestIndex + 1);

    return {
      previousStopId: orderedStopIds[prevIndex],
      nextStopId: status === 'AT_STOP' ? orderedStopIds[nextIndex] : closestStopId,
      status,
    };
  }

  private notifyListeners() {
    this.listeners.forEach(({ callback, filterBusId }) => {
      if (filterBusId) {
        const filtered = this.buses.filter((b) => b.busId === filterBusId);
        callback(filtered);
      } else {
        callback(this.buses);
      }
    });
  }

  async getAllBuses(): Promise<BusLiveLocation[]> {
    return this.buses;
  }

  async getBusById(busId: string): Promise<BusLiveLocation | null> {
    return this.buses.find((b) => b.busId === busId) || null;
  }

  async getBusesByRoute(routeId: string): Promise<BusLiveLocation[]> {
    return this.buses.filter((b) => b.routeId === routeId);
  }

  subscribeToBusUpdates(
    callback: BusUpdateListener,
    filterBusId?: string
  ): () => void {
    const id = Math.random().toString(36).substring(2, 9);
    this.listeners.add({ id, callback, filterBusId });

    // Send immediate initial state
    if (filterBusId) {
      const filtered = this.buses.filter((b) => b.busId === filterBusId);
      callback(filtered);
    } else {
      callback(this.buses);
    }

    // Ensure loop is running on client
    if (typeof window !== 'undefined' && !this.intervalId) {
      this.startSimulationLoop();
    }

    return () => {
      this.listeners.forEach((item) => {
        if (item.id === id) {
          this.listeners.delete(item);
        }
      });
    };
  }

  async calculateEtaToStop(busId: string, stopId: string): Promise<number> {
    const bus = this.buses.find((b) => b.busId === busId);
    if (!bus) return 10;

    const route = MYSURU_ROUTES.find((r) => r.id === bus.routeId);
    const stop = MYSURU_STOPS.find((s) => s.id === stopId);
    if (!route || !stop) return 10;

    const remainingDistanceMeters = getRemainingDistanceToStop(
      bus.currentCoordinates,
      stop.coordinates,
      route.polylineCoordinates
    );

    // Calculate time based on average speed (24 km/h = 400 m/min)
    const speedMetersPerMin = (SIMULATION_CONFIG.averageBusSpeedKmH * 1000) / 60;
    const rawMinutes = remainingDistanceMeters / speedMetersPerMin;

    return Math.max(1, Math.round(rawMinutes));
  }

  isSimulationRunning(): boolean {
    return this.isRunning;
  }

  setSimulationRunning(running: boolean): void {
    this.isRunning = running;
    this.notifyListeners();
  }

  getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }

  setSpeedMultiplier(multiplier: number): void {
    this.speedMultiplier = Math.max(1, Math.min(10, multiplier));
  }
}

// Global Singleton to maintain consistent simulation state across views
export const mockBusLocationService = new MockBusLocationService();

// Smooth spline interpolation along road coordinates
