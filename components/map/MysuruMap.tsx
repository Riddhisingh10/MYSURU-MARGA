'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { BusLiveLocation, BusStop, BusRoute, Coordinates } from '@/types/bus';
import { Loader2 } from 'lucide-react';

interface MysuruMapProps {
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

// Client-only dynamic import for Leaflet
const DynamicMap = dynamic(
  () => import('./MysuruMapInner').then((mod) => mod.MysuruMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] rounded-2xl border border-[#E5D8C8] bg-[#FFFCF7] flex flex-col items-center justify-center gap-3 text-[#776E68]">
        <Loader2 className="w-8 h-8 animate-spin text-[#702C3B]" />
        <span className="text-sm font-medium">Loading interactive Mysuru map...</span>
      </div>
    ),
  }
);

export const MysuruMap: React.FC<MysuruMapProps> = (props) => {
  return <DynamicMap {...props} />;
};

// SSR dynamic loading skeleton placeholder
