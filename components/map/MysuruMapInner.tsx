'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  BusLiveLocation,
  BusStop,
  BusRoute,
  Coordinates,
} from '@/types/bus';
import { MYSURU_CENTER } from '@/lib/constants';
import { MapLegend } from './MapLegend';
import { Maximize2, LocateFixed } from 'lucide-react';

interface MysuruMapInnerProps {
  buses: BusLiveLocation[];
  stops: BusStop[];
  routes: BusRoute[];
  selectedRoute: BusRoute | null;
  selectedBus: BusLiveLocation | null;
  boardingStop: BusStop | null;
  destinationStop: BusStop | null;
  userLocation: Coordinates | null;
  onSelectBus?: (bus: BusLiveLocation) => void;
  onSelectStop?: (stop: BusStop) => void;
  fitBoundsTrigger?: number;
  autoCenterOnBus?: boolean;
}

export const MysuruMapInner: React.FC<MysuruMapInnerProps> = ({
  buses,
  stops,
  routes,
  selectedRoute,
  selectedBus,
  boardingStop,
  destinationStop,
  userLocation,
  onSelectBus,
  onSelectStop,
  fitBoundsTrigger,
  autoCenterOnBus,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layers and marker registries
  const busMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const stopMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routePolylinesRef = useRef<Map<string, L.Polyline>>(new Map());
  const selectedPolylineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [MYSURU_CENTER.lat, MYSURU_CENTER.lng],
      zoom: 13,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false,
    });

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Warm, crisp OpenStreetMap base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Mysuru Marga',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean existing selected polyline
    if (selectedPolylineRef.current) {
      selectedPolylineRef.current.remove();
      selectedPolylineRef.current = null;
    }

    // Clear existing background route polylines
    routePolylinesRef.current.forEach((poly) => poly.remove());
    routePolylinesRef.current.clear();

    // If a specific route is selected, draw subtle background routes and highlight the selected one
    routes.forEach((route) => {
      const isSelected = selectedRoute?.id === route.id;
      const coords: L.LatLngExpression[] = route.polylineCoordinates.map((p) => [
        p.lat,
        p.lng,
      ]);

      if (isSelected) {
        // Casing layer for contrast
        const casing = L.polyline(coords, {
          color: '#ffffff',
          weight: 7,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        // Primary maroon route polyline
        const poly = L.polyline(coords, {
          color: '#702C3B',
          weight: 5,
          opacity: 1,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        selectedPolylineRef.current = poly;
        routePolylinesRef.current.set(`casing-${route.id}`, casing);
        routePolylinesRef.current.set(route.id, poly);
      } else if (!selectedRoute) {
        // When no single route is selected, show general route network in soft maroon/grey
        const poly = L.polyline(coords, {
          color: '#702C3B',
          weight: 3,
          opacity: 0.45,
          dashArray: '4, 4',
        }).addTo(map);
        routePolylinesRef.current.set(route.id, poly);
      }
    });
  }, [routes, selectedRoute]);

  // Update Bus Stop Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove obsolete stops
    stopMarkersRef.current.forEach((marker, id) => {
      if (!stops.some((s) => s.id === id)) {
        marker.remove();
        stopMarkersRef.current.delete(id);
      }
    });

    stops.forEach((stop) => {
      const isBoarding = boardingStop?.id === stop.id;
      const isDestination = destinationStop?.id === stop.id;

      let iconHtml = '';
      let iconSize: [number, number] = [20, 20];
      let iconAnchor: [number, number] = [10, 10];

      if (isBoarding) {
        iconSize = [32, 32];
        iconAnchor = [16, 16];
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-[#2D6A4F]/25 animate-ping"></span>
            <div class="w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow-lg border-2 border-white font-bold text-xs">
              B
            </div>
          </div>
        `;
      } else if (isDestination) {
        iconSize = [32, 32];
        iconAnchor = [16, 16];
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-[#702C3B]/25 animate-ping"></span>
            <div class="w-8 h-8 rounded-full bg-[#702C3B] text-white flex items-center justify-center shadow-lg border-2 border-white font-bold text-xs">
              D
            </div>
          </div>
        `;
      } else {
        iconSize = [18, 18];
        iconAnchor = [9, 9];
        iconHtml = `
          <div class="w-4 h-4 rounded-full bg-white border-2 border-[#702C3B] shadow-sm hover:scale-125 transition-transform"></div>
        `;
      }

      const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-stop-div-icon',
        iconSize,
        iconAnchor,
      });

      let marker = stopMarkersRef.current.get(stop.id);
      if (!marker) {
        marker = L.marker([stop.coordinates.lat, stop.coordinates.lng], { icon });
        marker.addTo(map);

        marker.on('click', () => {
          onSelectStop?.(stop);
        });

        stopMarkersRef.current.set(stop.id, marker);
      } else {
        marker.setIcon(icon);
        marker.setLatLng([stop.coordinates.lat, stop.coordinates.lng]);
      }

      const popupContent = `
        <div style="padding: 4px; font-family: inherit;">
          <div style="font-weight: 700; font-size: 13px; color: #702C3B; margin-bottom: 2px;">
            ${stop.name}
          </div>
          ${stop.kannadaName ? `<div style="font-size: 11px; color: #776E68; margin-bottom: 4px;">${stop.kannadaName}</div>` : ''}
          <div style="font-size: 11px; color: #282321; line-height: 1.3;">
            ${stop.landmark || 'Mysuru City Bus Stop'}
          </div>
          <div style="margin-top: 6px; font-size: 10px; color: #776E68;">
            Serves Routes: <strong>${stop.routesServing.join(', ')}</strong>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);
    });
  }, [stops, boardingStop, destinationStop, onSelectStop]);

  // Update Moving Bus Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Filter buses if selectedRoute is set
    const displayedBuses = selectedRoute
      ? buses.filter((b) => b.routeId === selectedRoute.id)
      : buses;

    // Remove markers that are no longer active
    busMarkersRef.current.forEach((marker, busId) => {
      if (!displayedBuses.some((b) => b.busId === busId)) {
        marker.remove();
        busMarkersRef.current.delete(busId);
      }
    });

    displayedBuses.forEach((bus) => {
      const isSelected = selectedBus?.busId === bus.busId;
      const isApproaching = bus.status === 'APPROACHING';

      // Custom Bus Icon with Route Number and Direction Pointer
      const iconHtml = `
        <div class="custom-bus-marker relative flex items-center justify-center cursor-pointer select-none">
          ${
            isSelected || isApproaching
              ? `<span class="absolute -inset-1 rounded-full bg-[#702C3B]/30 animate-pulse"></span>`
              : ''
          }
          <div class="flex items-center gap-1 px-2 py-1 rounded-full ${
            isSelected
              ? 'bg-[#702C3B] text-white ring-2 ring-white shadow-xl'
              : 'bg-[#FFFCF7] text-[#702C3B] border-2 border-[#702C3B] shadow-md'
          } font-bold text-xs">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
            </svg>
            <span>${bus.routeNumber}</span>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-bus-div-icon',
        iconSize: [64, 30],
        iconAnchor: [32, 15],
      });

      let marker = busMarkersRef.current.get(bus.busId);
      if (!marker) {
        marker = L.marker([bus.currentCoordinates.lat, bus.currentCoordinates.lng], {
          icon,
          zIndexOffset: isSelected ? 1000 : 500,
        });
        marker.addTo(map);

        marker.on('click', () => {
          onSelectBus?.(bus);
        });

        busMarkersRef.current.set(bus.busId, marker);
      } else {
        marker.setIcon(icon);
        marker.setLatLng([bus.currentCoordinates.lat, bus.currentCoordinates.lng]);
        marker.setZIndexOffset(isSelected ? 1000 : 500);
      }

      // Popup
      const nextStopName =
        stops.find((s) => s.id === bus.nextStopId)?.name || 'Next Stop';

      const popupContent = `
        <div style="padding: 4px; font-family: inherit;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-weight: 800; font-size: 14px; color: #702C3B;">Route ${bus.routeNumber}</span>
            <span style="font-size: 9px; background: #702C3B; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 600;">DEMO</span>
          </div>
          <div style="font-size: 11px; color: #282321; font-weight: 600;">
            To: ${bus.destination}
          </div>
          <div style="font-size: 11px; color: #776E68; margin-top: 4px;">
            Next Stop: <strong>${nextStopName}</strong>
          </div>
          <div style="font-size: 10px; color: #776E68; margin-top: 2px;">
            Speed: ${bus.speedKmH} km/h • ID: ${bus.busId}
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);
    });

    // Auto-center on selected bus if active tracking is enabled
    if (autoCenterOnBus && selectedBus) {
      map.panTo([selectedBus.currentCoordinates.lat, selectedBus.currentCoordinates.lng], {
        animate: true,
        duration: 0.5,
      });
    }
  }, [buses, selectedRoute, selectedBus, stops, onSelectBus, autoCenterOnBus]);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userLocation) {
      const iconHtml = `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-8 h-8 rounded-full bg-blue-500/25 animate-ping"></span>
          <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: 'user-loc-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon,
          zIndexOffset: 800,
        }).addTo(map);
        userMarkerRef.current.bindPopup(
          '<div style="font-size: 11px; font-weight: 600;">Your Current Location</div>'
        );
      } else {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userLocation]);

  // Fit bounds when trigger updates or route changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedRoute && selectedRoute.polylineCoordinates.length > 0) {
      const bounds = L.latLngBounds(
        selectedRoute.polylineCoordinates.map((c) => [c.lat, c.lng])
      );

      if (boardingStop) {
        bounds.extend([boardingStop.coordinates.lat, boardingStop.coordinates.lng]);
      }
      if (destinationStop) {
        bounds.extend([destinationStop.coordinates.lat, destinationStop.coordinates.lng]);
      }
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }

      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [fitBoundsTrigger, selectedRoute, boardingStop, destinationStop, userLocation]);

  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedRoute) {
      const bounds = L.latLngBounds(
        selectedRoute.polylineCoordinates.map((c) => [c.lat, c.lng])
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      map.setView([MYSURU_CENTER.lat, MYSURU_CENTER.lng], 13);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-[#E5D8C8] shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Controls */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        <button
          onClick={handleResetView}
          title="Fit journey or reset to Mysuru city"
          className="p-2.5 rounded-xl bg-[#FFFCF7]/95 border border-[#E5D8C8] text-[#702C3B] shadow-md hover:bg-white transition-all flex items-center gap-1.5 text-xs font-semibold"
        >
          <Maximize2 className="w-4 h-4" />
          <span className="hidden sm:inline">Fit Map</span>
        </button>
      </div>

      <MapLegend />
    </div>
  );
};

// Smooth leaflet panTo animation duration: 500ms
