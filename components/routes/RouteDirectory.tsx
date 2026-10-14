'use client';

import React, { useState } from 'react';
import {
  Bus,
  Search,
  Clock,
  ArrowRight,
  MapPin,
  Route,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { BusRoute, BusStop } from '@/types/bus';
import { formatDuration } from '@/lib/time';

interface RouteDirectoryProps {
  routes: BusRoute[];
  stops: BusStop[];
  selectedRoute: BusRoute | null;
  onSelectRoute: (route: BusRoute) => void;
  onTrackRoute: (route: BusRoute) => void;
}

export const RouteDirectory: React.FC<RouteDirectoryProps> = ({
  routes,
  stops,
  selectedRoute,
  onSelectRoute,
  onTrackRoute,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoutes = routes.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.routeNumber.toLowerCase().includes(q) ||
      r.routeName.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-[#FFFCF7] border border-[#E5D8C8] rounded-2xl p-4 shadow-sm">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-[#702C3B]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by route number, stop, or destination (e.g. 119, Chamundi, Kuvempunagar)..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#F7F1E7]/70 border border-[#E5D8C8] rounded-xl text-sm font-medium text-[#282321] placeholder-[#776E68]/70 focus:outline-none focus:ring-2 focus:ring-[#702C3B] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Routes Count */}
      <div className="flex items-center justify-between text-xs text-[#776E68] px-1 font-medium">
        <span>Showing {filteredRoutes.length} of {routes.length} Mysuru Demonstration Routes</span>
        <span className="text-[11px] bg-[#702C3B]/10 text-[#702C3B] px-2 py-0.5 rounded font-bold">
          DEMO SCHEDULES
        </span>
      </div>

      {/* Routes Grid / List */}
      <div className="space-y-3.5">
        {filteredRoutes.map((route) => {
          const isSelected = selectedRoute?.id === route.id;
          const stopNames = route.orderedStopIds
            .map((id) => stops.find((s) => s.id === id)?.name || id)
            .join(' ➔ ');

          return (
            <div
              key={route.id}
              className={`rounded-2xl border transition-all p-5 ${
                isSelected
                  ? 'bg-[#FFFCF7] border-[#702C3B] ring-2 ring-[#702C3B]/20 shadow-md'
                  : 'bg-[#FFFCF7] border-[#E5D8C8] hover:border-[#702C3B]/40 hover:shadow-xs'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#E5D8C8]/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#702C3B] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <Bus className="w-5 h-5 text-[#F7F1E7]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#282321]">
                        {route.routeNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F7F1E7] text-[#702C3B] border border-[#E5D8C8]">
                        Every {route.frequencyMinutes} min
                      </span>
                    </div>
                    <div className="text-xs text-[#776E68] font-medium mt-0.5">
                      {route.routeName}
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-extrabold text-[#702C3B]">
                    ~{formatDuration(route.approxDurationMinutes)}
                  </div>
                  <div className="text-[11px] text-[#776E68]">
                    {route.stops.length} Stops
                  </div>
                </div>
              </div>

              {/* Origin to Destination row */}
              <div className="py-3 text-xs flex items-center gap-2 text-[#282321]">
                <div className="flex items-center gap-1.5 font-bold truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#2D6A4F] flex-shrink-0" />
                  <span>{route.origin}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#776E68] flex-shrink-0" />
                <div className="flex items-center gap-1.5 font-bold truncate text-[#702C3B]">
                  <MapPin className="w-3.5 h-3.5 text-[#702C3B] flex-shrink-0" />
                  <span>{route.destination}</span>
                </div>
              </div>

              {/* Stop sequence preview */}
              <div className="bg-[#F7F1E7]/70 p-2.5 rounded-xl border border-[#E5D8C8]/50 text-[11px] text-[#776E68]">
                <div className="font-semibold text-[#282321] mb-1 flex items-center gap-1">
                  <Route className="w-3.5 h-3.5 text-[#702C3B]" /> Route Stops:
                </div>
                <div className="truncate">{stopNames}</div>
              </div>

              {/* Actions */}
              <div className="pt-3.5 mt-3 border-t border-[#E5D8C8]/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onSelectRoute(route)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#702C3B] text-white'
                      : 'border border-[#E5D8C8] bg-white text-[#282321] hover:bg-[#F7F1E7]'
                  }`}
                >
                  {isSelected ? 'Route Selected on Map' : 'View on Map'}
                </button>
                <button
                  type="button"
                  onClick={() => onTrackRoute(route)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#702C3B] hover:bg-[#8D4554] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Activity className="w-3.5 h-3.5" />
                  Track Buses
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Real-time route filtering across name, number, and stops
