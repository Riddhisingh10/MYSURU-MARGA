'use client';

import React, { useState, useEffect } from 'react';
import {
  Bus,
  MapPin,
  Clock,
  ArrowLeft,
  Navigation,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Footprints,
  Compass,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import {
  BusLiveLocation,
  BusRoute,
  BusStop,
  JourneyOption,
} from '@/types/bus';
import { mockBusLocationService } from '@/services/MockBusLocationService';
import { formatEtaCountdown, calculateFutureClockTime, formatDistance } from '@/lib/time';
import { getDistanceMeters } from '@/lib/geo';

interface LiveTrackingPanelProps {
  journey: JourneyOption;
  route: BusRoute;
  allStops: BusStop[];
  onBack: () => void;
  onRecenter: () => void;
}

export const LiveTrackingPanel: React.FC<LiveTrackingPanelProps> = ({
  journey,
  route,
  allStops,
  onBack,
  onRecenter,
}) => {
  const [liveBus, setLiveBus] = useState<BusLiveLocation | null>(
    journey.assignedBus || null
  );
  const [etaMinutes, setEtaMinutes] = useState<number>(
    journey.estimatedArrivalAtBoardingMinutes || 6
  );
  const [distanceRemainingMeters, setDistanceRemainingMeters] = useState<number>(1400);
  const [simRunning, setSimRunning] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // Subscribe to live updates for this route/bus
  useEffect(() => {
    const busId = journey.assignedBus?.busId;

    const unsubscribe = mockBusLocationService.subscribeToBusUpdates((buses) => {
      // Find the tracked bus or match route
      const found =
        buses.find((b) => b.busId === busId) ||
        buses.find((b) => b.routeId === route.id) ||
        buses[0];

      if (found) {
        setLiveBus(found);

        // Recalculate ETA to passenger's boarding stop
        mockBusLocationService
          .calculateEtaToStop(found.busId, journey.boardingStop.id)
          .then((mins) => {
            setEtaMinutes(mins);
          });

        // Calculate direct distance
        const dist = getDistanceMeters(
          found.currentCoordinates,
          journey.boardingStop.coordinates
        );
        setDistanceRemainingMeters(dist);
      }
    }, busId);

    return () => {
      unsubscribe();
    };
  }, [journey, route]);

  const toggleSimulation = () => {
    const nextState = !simRunning;
    mockBusLocationService.setSimulationRunning(nextState);
    setSimRunning(nextState);
  };

  const handleSpeedChange = (mult: number) => {
    mockBusLocationService.setSpeedMultiplier(mult);
    setSpeedMultiplier(mult);
  };

  // Derive contextual passenger status message
  const getStatusBanner = () => {
    if (!liveBus) return { text: 'Locating simulated bus...', color: 'bg-stone-100 text-stone-700' };

    const boardingIndex = route.orderedStopIds.indexOf(journey.boardingStop.id);
    const busNextIndex = route.orderedStopIds.indexOf(liveBus.nextStopId);

    if (liveBus.status === 'AT_STOP' && liveBus.nextStopId === journey.boardingStop.id) {
      return {
        text: `Your bus has arrived at ${journey.boardingStop.name}! Prepare to board.`,
        color: 'bg-[#2D6A4F] text-white',
        instruction: 'The bus is waiting at your stop now.',
      };
    }

    if (busNextIndex > boardingIndex) {
      const destIndex = route.orderedStopIds.indexOf(journey.destinationStop.id);
      const remainingToDest = Math.max(0, destIndex - busNextIndex);
      return {
        text: `Bus has passed ${journey.boardingStop.name}. Travelling towards your destination.`,
        color: 'bg-[#702C3B] text-white',
        instruction: `Your destination ${journey.destinationStop.name} is ${remainingToDest} stop${remainingToDest === 1 ? '' : 's'} away.`,
      };
    }

    const stopsAway = Math.max(0, boardingIndex - busNextIndex + 1);
    if (stopsAway <= 1 || etaMinutes <= 2) {
      return {
        text: 'Your bus is approaching your stop now!',
        color: 'bg-[#B07D14] text-white',
        instruction: `Walk to ${journey.boardingStop.name}. Bus arriving ${formatEtaCountdown(etaMinutes)}.`,
      };
    }

    return {
      text: `Your bus is ${stopsAway} stops away (${formatEtaCountdown(etaMinutes)}).`,
      color: 'bg-[#FFFCF7] border border-[#E5D8C8] text-[#282321]',
      instruction: `Please reach ${journey.boardingStop.name} in advance. Estimated walk: ${journey.totalWalkingMinutes} min.`,
    };
  };

  const banner = getStatusBanner();
  const nextStopObj = allStops.find((s) => s.id === liveBus?.nextStopId);

  return (
    <div className="space-y-4">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#FFFCF7] border border-[#E5D8C8] rounded-xl px-4 py-2.5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#702C3B] hover:text-[#8D4554] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Journey Options
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#702C3B]/10 text-[#702C3B] border border-[#702C3B]/20">
            <Radio className="w-3 h-3 animate-pulse text-[#2D6A4F]" />
            LIVE SIMULATION
          </span>
          <button
            onClick={onRecenter}
            className="p-1.5 rounded-lg border border-[#E5D8C8] bg-white text-[#282321] hover:bg-[#F7F1E7] text-xs font-semibold flex items-center gap-1"
            title="Re-center on tracked bus"
          >
            <Navigation className="w-3.5 h-3.5 text-[#702C3B]" />
            <span className="hidden sm:inline">Center Bus</span>
          </button>
        </div>
      </div>

      {/* Dynamic Status Notification Banner */}
      <div
        className={`p-4 rounded-2xl shadow-xs transition-all flex items-start gap-3 ${banner.color}`}
      >
        <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs flex-shrink-0">
          <Bus className="w-5 h-5 text-current" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm tracking-tight">{banner.text}</div>
          <div className="text-xs opacity-90 mt-0.5">{banner.instruction}</div>
        </div>
      </div>

      {/* Main Bus Information Card */}
      <div className="bg-[#FFFCF7] border border-[#E5D8C8] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        {/* Bus ID & Route Title */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5D8C8]/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-[#282321]">
                {route.routeNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#F7F1E7] text-[#702C3B] border border-[#E5D8C8]">
                {liveBus?.busId || 'KA-09-F-1191'}
              </span>
            </div>
            <div className="text-xs text-[#776E68] mt-1 font-medium">
              Destination: <strong className="text-[#282321]">{route.destination}</strong>
            </div>
          </div>

          {/* Big ETA Countdown */}
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-[#702C3B] tracking-tight">
              {formatEtaCountdown(etaMinutes)}
            </div>
            <div className="text-[11px] text-[#776E68]">
              Boarding at ~{calculateFutureClockTime(etaMinutes)}
            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#F7F1E7]/70 rounded-xl border border-[#E5D8C8]/60">
            <div className="text-[#776E68] text-[10px] uppercase font-bold tracking-wider">
              Next Stop
            </div>
            <div className="font-bold text-[#282321] truncate mt-0.5">
              {nextStopObj?.name || 'In Transit'}
            </div>
          </div>

          <div className="p-3 bg-[#F7F1E7]/70 rounded-xl border border-[#E5D8C8]/60">
            <div className="text-[#776E68] text-[10px] uppercase font-bold tracking-wider">
              Distance to You
            </div>
            <div className="font-bold text-[#282321] mt-0.5">
              {formatDistance(distanceRemainingMeters)}
            </div>
          </div>

          <div className="p-3 bg-[#F7F1E7]/70 rounded-xl border border-[#E5D8C8]/60">
            <div className="text-[#776E68] text-[10px] uppercase font-bold tracking-wider">
              Current Speed
            </div>
            <div className="font-bold text-[#282321] mt-0.5">
              {liveBus?.speedKmH || 25} km/h
            </div>
          </div>

          <div className="p-3 bg-[#F7F1E7]/70 rounded-xl border border-[#E5D8C8]/60">
            <div className="text-[#776E68] text-[10px] uppercase font-bold tracking-wider">
              Sim Status
            </div>
            <div className="font-bold text-[#2D6A4F] mt-0.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              {liveBus?.status.replace('_', ' ') || 'ACTIVE'}
            </div>
          </div>
        </div>

        {/* Upcoming Stops Timeline */}
        <div className="pt-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#776E68] mb-3">
            Route Progress & Upcoming Stops Timeline
          </h5>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5D8C8]">
            {route.orderedStopIds.map((stopId, index) => {
              const stop = allStops.find((s) => s.id === stopId);
              if (!stop) return null;

              const isBoarding = journey.boardingStop.id === stopId;
              const isDestination = journey.destinationStop.id === stopId;
              const isNextStop = liveBus?.nextStopId === stopId;

              // Check if bus has already passed this stop
              const busNextIndex = route.orderedStopIds.indexOf(
                liveBus?.nextStopId || ''
              );
              const hasPassed = busNextIndex > index;

              return (
                <div key={stopId} className="relative flex items-start justify-between text-xs">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 mt-1 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      isBoarding
                        ? 'bg-[#2D6A4F] border-white ring-2 ring-[#2D6A4F]'
                        : isDestination
                        ? 'bg-[#702C3B] border-white ring-2 ring-[#702C3B]'
                        : hasPassed
                        ? 'bg-[#776E68]/30 border-[#776E68]/40'
                        : isNextStop
                        ? 'bg-[#B07D14] border-white ring-2 ring-[#B07D14] animate-pulse'
                        : 'bg-white border-[#702C3B]'
                    }`}
                  />

                  {/* Stop Name and tags */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          hasPassed
                            ? 'text-[#776E68] line-through'
                            : isBoarding || isDestination
                            ? 'text-[#702C3B] text-sm'
                            : 'text-[#282321]'
                        }`}
                      >
                        {stop.name}
                      </span>
                      {isBoarding && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#2D6A4F] text-white">
                          YOUR BOARDING STOP
                        </span>
                      )}
                      {isDestination && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#702C3B] text-white">
                          YOUR DESTINATION
                        </span>
                      )}
                      {isNextStop && !hasPassed && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#B07D14] text-white">
                          BUS APPROACHING
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#776E68] mt-0.5">
                      {stop.landmark || 'Mysuru Stop'}
                    </div>
                  </div>

                  {/* Timing indicator */}
                  <div className="text-right text-[11px] text-[#776E68] flex-shrink-0">
                    {hasPassed ? (
                      <span className="text-[#776E68]/60">Passed</span>
                    ) : isBoarding ? (
                      <span className="font-bold text-[#2D6A4F]">
                        {formatEtaCountdown(etaMinutes)}
                      </span>
                    ) : (
                      <span>Stop {index + 1}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demo Simulation Controls */}
        <div className="pt-4 border-t border-[#E5D8C8]/60 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#F7F1E7]/50 p-3 rounded-xl">
          <div className="flex items-center gap-2 text-[#776E68]">
            <span className="font-semibold text-[#282321]">Demo Movement:</span>
            <button
              onClick={toggleSimulation}
              className="p-1.5 rounded-lg border border-[#E5D8C8] bg-white hover:bg-[#F7F1E7] text-[#702C3B] font-bold flex items-center gap-1"
            >
              {simRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {simRunning ? 'Pause' : 'Resume'}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#776E68] text-[11px]">Speed:</span>
            {[1, 2, 5].map((mult) => (
              <button
                key={mult}
                onClick={() => handleSpeedChange(mult)}
                className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                  speedMultiplier === mult
                    ? 'bg-[#702C3B] text-white shadow-xs'
                    : 'bg-white border border-[#E5D8C8] text-[#776E68] hover:text-[#282321]'
                }`}
              >
                {mult}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dynamic status banner: approaching vs in_transit vs at_stop
