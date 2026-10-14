import { Coordinates, BusStop, LocationSuggestion } from '@/types/bus';
import { ILocationSearchService } from './types';
import { MYSURU_STOPS } from '@/data/stops';
import { getDistanceMeters } from '@/lib/geo';
import { MYSURU_CENTER } from '@/lib/constants';

// Curated list of prominent Mysuru landmarks and hubs
const MYSURU_LANDMARKS: LocationSuggestion[] = [
  {
    id: 'lm-palace',
    name: 'Mysuru Palace (Amba Vilas)',
    description: 'Historical Royal Palace, Sayyaji Rao Rd',
    coordinates: { lat: 12.3051, lng: 76.6551 },
    type: 'landmark',
    matchedStopId: 'stop-palace',
  },
  {
    id: 'lm-chamundi-temple',
    name: 'Chamundi Hill Temple',
    description: 'Sri Chamundeshwari Temple atop Chamundi Hill',
    coordinates: { lat: 12.2748, lng: 76.6710 },
    type: 'landmark',
    matchedStopId: 'stop-chamundi-temple',
  },
  {
    id: 'lm-chamundi-steps',
    name: 'Chamundi Hill Steps (Foot)',
    description: 'Tavarekatte, Hill Steps Start Point',
    coordinates: { lat: 12.2858, lng: 76.6780 },
    type: 'landmark',
    matchedStopId: 'stop-chamundi-foot',
  },
  {
    id: 'lm-zoo',
    name: 'Sri Chamarajendra Zoological Gardens (Mysuru Zoo)',
    description: 'Indiranagar, near Karanji Lake',
    coordinates: { lat: 12.3023, lng: 76.6669 },
    type: 'landmark',
    matchedStopId: 'stop-zoo',
  },
  {
    id: 'lm-cbs',
    name: 'Mysuru City Bus Stand (CBS)',
    description: 'Central City Bus Terminal, Sayyaji Rao Rd',
    coordinates: { lat: 12.3086, lng: 76.6542 },
    type: 'stop',
    matchedStopId: 'stop-cbs',
  },
  {
    id: 'lm-suburban',
    name: 'KSRTC Suburban Bus Stand (Mofussil)',
    description: 'Intercity Bus Stand, B.N. Road',
    coordinates: { lat: 12.3121, lng: 76.6589 },
    type: 'stop',
    matchedStopId: 'stop-suburban',
  },
  {
    id: 'lm-railway',
    name: 'Mysuru Junction Railway Station',
    description: 'Medar Block, Yadavagiri / Railway Colony',
    coordinates: { lat: 12.3158, lng: 76.6438 },
    type: 'landmark',
    matchedStopId: 'stop-railway-station',
  },
  {
    id: 'lm-kuvempunagar',
    name: 'Kuvempunagar Bus Depot & Complex',
    description: 'Kuvempunagar Main Shopping Complex',
    coordinates: { lat: 12.2842, lng: 76.6268 },
    type: 'landmark',
    matchedStopId: 'stop-kuvempunagar',
  },
  {
    id: 'lm-vijayanagar',
    name: 'Vijayanagar Water Tank',
    description: 'Vijayanagar 1st Stage, High Tension Rd',
    coordinates: { lat: 12.3275, lng: 76.6080 },
    type: 'landmark',
    matchedStopId: 'stop-vijayanagar-water-tank',
  },
  {
    id: 'lm-infosys',
    name: 'Infosys Mysore Campus (Hebbal)',
    description: 'Electronics City, Hebbal Industrial Area',
    coordinates: { lat: 12.3615, lng: 76.5940 },
    type: 'landmark',
    matchedStopId: 'stop-infosys-hebbal',
  },
  {
    id: 'lm-st-philomena',
    name: "St. Philomena's Cathedral",
    description: 'Ashoka Road, Catholic Cathedral',
    coordinates: { lat: 12.3209, lng: 76.6575 },
    type: 'landmark',
    matchedStopId: 'stop-suburban',
  },
  {
    id: 'lm-karanji',
    name: 'Karanji Lake & Nature Park',
    description: 'Behind Mysore Zoo, Siddharthanagar',
    coordinates: { lat: 12.3015, lng: 76.6740 },
    type: 'landmark',
    matchedStopId: 'stop-zoo',
  },
  {
    id: 'lm-kukkarahalli',
    name: 'Kukkarahalli Lake',
    description: 'Near University of Mysore Campus, Saraswathipuram',
    coordinates: { lat: 12.3080, lng: 76.6320 },
    type: 'landmark',
    matchedStopId: 'stop-saraswathipuram',
  },
];

export class LocationSearchService implements ILocationSearchService {
  private cache = new Map<string, LocationSuggestion[]>();

  async searchLocations(query: string): Promise<LocationSuggestion[]> {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    if (this.cache.has(q)) {
      return this.cache.get(q)!;
    }

    const results: LocationSuggestion[] = [];

    // 1. Search in curated landmarks
    for (const lm of MYSURU_LANDMARKS) {
      if (
        lm.name.toLowerCase().includes(q) ||
        lm.description.toLowerCase().includes(q)
      ) {
        results.push(lm);
      }
    }

    // 2. Search in bus stops
    for (const stop of MYSURU_STOPS) {
      if (
        stop.name.toLowerCase().includes(q) ||
        (stop.kannadaName && stop.kannadaName.includes(q)) ||
        (stop.landmark && stop.landmark.toLowerCase().includes(q))
      ) {
        if (!results.some((r) => r.matchedStopId === stop.id)) {
          results.push({
            id: `stop-sugg-${stop.id}`,
            name: `${stop.name} (Bus Stop)`,
            description: stop.landmark || `Serves routes: ${stop.routesServing.join(', ')}`,
            coordinates: stop.coordinates,
            type: 'stop',
            matchedStopId: stop.id,
          });
        }
      }
    }

    // 3. Optional: Online Nominatim search bounded to Mysuru if fewer than 3 local matches
    if (results.length < 3 && typeof window !== 'undefined') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s quick timeout
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ' Mysore'
        )}&bounded=1&viewbox=76.57,12.39,76.73,12.22&limit=4`;

        const resp = await fetch(url, {
          signal: controller.signal,
          headers: { 'Accept-Language': 'en' },
        });
        clearTimeout(timeoutId);

        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data)) {
            for (const item of data) {
              const lat = parseFloat(item.lat);
              const lng = parseFloat(item.lon);
              if (!isNaN(lat) && !isNaN(lng)) {
                // Find nearest stop
                const nearestStop = this.findNearestStop({ lat, lng });
                results.push({
                  id: `osm-${item.osm_id || Math.random()}`,
                  name: item.name || item.display_name.split(',')[0],
                  description: item.display_name.split(',').slice(1, 3).join(',').trim(),
                  coordinates: { lat, lng },
                  type: 'place',
                  matchedStopId: nearestStop?.id,
                });
              }
            }
          }
        }
      } catch {
        // Fallback gracefully on network/CORS/timeout errors
      }
    }

    this.cache.set(q, results);
    return results;
  }

  async getNearbyStops(coords: Coordinates, radiusMeters: number = 1500): Promise<BusStop[]> {
    const stopsWithDist = MYSURU_STOPS.map((stop) => ({
      stop,
      distance: getDistanceMeters(coords, stop.coordinates),
    }))
      .filter((item) => item.distance <= radiusMeters)
      .sort((a, b) => a.distance - b.distance);

    // If no stop within radius, expand to closest 3 stops
    if (stopsWithDist.length === 0) {
      const allSorted = MYSURU_STOPS.map((stop) => ({
        stop,
        distance: getDistanceMeters(coords, stop.coordinates),
      })).sort((a, b) => a.distance - b.distance);
      return allSorted.slice(0, 3).map((item) => item.stop);
    }

    return stopsWithDist.map((item) => item.stop);
  }

  getPopularDestinations(): LocationSuggestion[] {
    return [
      MYSURU_LANDMARKS[0], // Palace
      MYSURU_LANDMARKS[1], // Chamundi Hill
      MYSURU_LANDMARKS[3], // Zoo
      MYSURU_LANDMARKS[7], // Kuvempunagar
      MYSURU_LANDMARKS[8], // Vijayanagar
      MYSURU_LANDMARKS[9], // Infosys
    ];
  }

  async getCurrentPosition(): Promise<Coordinates> {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return MYSURU_CENTER;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }

  private findNearestStop(coords: Coordinates): BusStop | undefined {
    let nearest: BusStop | undefined;
    let minDist = Infinity;
    for (const stop of MYSURU_STOPS) {
      const d = getDistanceMeters(coords, stop.coordinates);
      if (d < minDist) {
        minDist = d;
        nearest = stop;
      }
    }
    return nearest;
  }
}

export const locationSearchService = new LocationSearchService();

// Search query minimum length threshold: 2 characters

// Bounding box for OpenStreetMap Nominatim queries: Mysuru Metropolitan Area
