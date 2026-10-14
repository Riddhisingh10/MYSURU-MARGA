import { BusRoute, BusStop } from '@/types/bus';
import { IRouteService } from './types';
import { MYSURU_ROUTES } from '@/data/routes';
import { MYSURU_STOPS } from '@/data/stops';

export class RouteService implements IRouteService {
  async getAllRoutes(): Promise<BusRoute[]> {
    return MYSURU_ROUTES;
  }

  async getRouteById(routeId: string): Promise<BusRoute | null> {
    return MYSURU_ROUTES.find((r) => r.id === routeId) || null;
  }

  async searchRoutes(query: string): Promise<BusRoute[]> {
    const q = query.trim().toLowerCase();
    if (!q) return MYSURU_ROUTES;

    return MYSURU_ROUTES.filter((r) => {
      if (r.routeNumber.toLowerCase().includes(q)) return true;
      if (r.routeName.toLowerCase().includes(q)) return true;
      if (r.origin.toLowerCase().includes(q)) return true;
      if (r.destination.toLowerCase().includes(q)) return true;

      // Also search through stop names
      const stopNames = r.orderedStopIds
        .map((id) => MYSURU_STOPS.find((s) => s.id === id)?.name?.toLowerCase() || '')
        .join(' ');
      if (stopNames.includes(q)) return true;

      return false;
    });
  }

  async getRoutesServingStop(stopId: string): Promise<BusRoute[]> {
    return MYSURU_ROUTES.filter((r) => r.orderedStopIds.includes(stopId));
  }

  async getAllStops(): Promise<BusStop[]> {
    return MYSURU_STOPS;
  }

  async getStopById(stopId: string): Promise<BusStop | null> {
    return MYSURU_STOPS.find((s) => s.id === stopId) || null;
  }
}

export const routeService = new RouteService();

// In-memory index of routes by serving stop ID
