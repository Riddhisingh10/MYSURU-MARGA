'use client';

import React from 'react';
import {
  Bus,
  Footprints,
  Clock,
  MapPin,
  ArrowRight,
  Eye,
  Activity,
  CheckCircle2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { JourneyOption } from '@/types/bus';
import { formatDuration, formatDistance, formatEtaCountdown } from '@/lib/time';

interface JourneyResultCardProps {
  journey: JourneyOption;
  isSelected: boolean;
  onViewRoute: (journey: JourneyOption) => void;
  onTrackBus: (journey: JourneyOption) => void;
}

export const JourneyResultCard: React.FC<JourneyResultCardProps> = ({
  journey,
  isSelected,
  onViewRoute,
  onTrackBus,
}) => {
  const isDirect = journey.type === 'DIRECT';
  const busLeg = journey.legs.find((l) => l.type === 'BUS_RIDE');
  const walkLeg = journey.legs.find((l) => l.type === 'WALK_TO_STOP');
  const walkDestLeg = journey.legs.find((l) => l.type === 'WALK_TO_DESTINATION');

  const walkMinutes = walkLeg?.durationMinutes || 4;
  const walkMeters = walkLeg?.distanceMeters || 250;

  const destWalkMinutes = walkDestLeg?.durationMinutes || 3;
  const destWalkMeters = walkDestLeg?.distanceMeters || 180;

  const scheduledTime = busLeg?.scheduledDepartureTime || '10:40 AM';
  const etaMinutes = journey.estimatedArrivalAtBoardingMinutes || 6;

  return (
    <div
      className={`relative rounded-2xl border transition-all ${
        isSelected
          ? 'bg-[#FFFCF7] border-[#702C3B] ring-2 ring-[#702C3B]/20 shadow-md'
          : 'bg-[#FFFCF7] border-[#E5D8C8] hover:border-[#702C3B]/40 hover:shadow-sm'
      } p-5 sm:p-6`}
    >
      {/* Header: Route Number & Destination */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#E5D8C8]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#702C3B] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <Bus className="w-5 h-5 text-[#F7F1E7]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-[#282321]">
                {journey.primaryRouteNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#702C3B]/10 text-[#702C3B] border border-[#702C3B]/20">
                {isDirect ? 'Direct' : '1 Transfer'}
              </span>
            </div>
            <div className="text-xs text-[#776E68] flex items-center gap-1 mt-0.5">
              <span>Towards:</span>
              <span className="font-semibold text-[#282321]">
                {journey.primaryDestination}
              </span>
            </div>
          </div>
        </div>

        {/* Total Duration & Arrival Time */}
        <div className="text-right">
          <div className="text-base sm:text-lg font-extrabold text-[#702C3B]">
            {formatDuration(journey.totalDurationMinutes)}
          </div>
          <div className="text-[11px] text-[#776E68]">
            Arrive by ~{journey.arrivalTimeText}
          </div>
        </div>
      </div>

      {/* Main Journey Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
        {/* Left Col: Boarding & Walking */}
        <div className="space-y-3">
          {/* Boarding Stop */}
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-[9px] mt-0.5 flex-shrink-0">
              B
            </div>
            <div>
              <div className="text-[11px] text-[#776E68] font-medium">Board at:</div>
              <div className="font-bold text-[#282321] text-sm">
                {journey.boardingStop.name}
              </div>
              <div className="text-[11px] text-[#776E68] mt-0.5">
                {journey.boardingStop.landmark || 'Mysuru City Bus Stop'}
              </div>
            </div>
          </div>

          {/* Walk to Stop */}
          <div className="flex items-center gap-2 text-[#776E68] pl-6">
            <Footprints className="w-3.5 h-3.5 text-[#702C3B]" />
            <span>
              Walk to stop: <strong>{walkMinutes} min</strong> ({formatDistance(walkMeters)})
            </span>
          </div>

          {/* Timings */}
          <div className="pl-6 space-y-1">
            <div className="flex items-center gap-2 text-[#282321]">
              <Calendar className="w-3.5 h-3.5 text-[#776E68]" />
              <span>
                Scheduled departure: <strong>{scheduledTime}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#2D6A4F] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>
                Estimated arrival: <strong>{formatEtaCountdown(etaMinutes)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Destination Stop & Bus Leg */}
        <div className="space-y-3 sm:border-l sm:border-[#E5D8C8]/60 sm:pl-4">
          {/* Destination Stop */}
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#702C3B] text-white flex items-center justify-center font-bold text-[9px] mt-0.5 flex-shrink-0">
              D
            </div>
            <div>
              <div className="text-[11px] text-[#776E68] font-medium">Alight at:</div>
              <div className="font-bold text-[#282321] text-sm">
                {journey.destinationStop.name}
              </div>
            </div>
          </div>

          {/* Bus Journey Info */}
          <div className="pl-6 space-y-1 text-[#282321]">
            <div className="flex items-center gap-2">
              <Bus className="w-3.5 h-3.5 text-[#702C3B]" />
              <span>
                In-bus journey: <strong>{journey.totalBusMinutes} min</strong> ({journey.numberOfStops} stops)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#776E68]">
              <Footprints className="w-3.5 h-3.5 text-[#702C3B]" />
              <span>
                Final walk to destination: <strong>{destWalkMinutes} min</strong> ({formatDistance(destWalkMeters)})
              </span>
            </div>
          </div>

          {/* Transfer detail if any */}
          {journey.transferStop && (
            <div className="pl-6 pt-1 text-[11px] text-[#B07D14] flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Change buses at: {journey.transferStop.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-[#E5D8C8]/60 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] text-[#776E68]">
          Demo Vehicle:{' '}
          <span className="font-semibold text-[#282321]">
            {journey.assignedBus?.busId || 'KA-09-F-1191'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewRoute(journey)}
            className="px-3.5 py-2 rounded-xl border border-[#E5D8C8] bg-white hover:bg-[#F7F1E7] text-xs font-semibold text-[#282321] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-[#702C3B]" />
            View Route
          </button>

          <button
            type="button"
            onClick={() => onTrackBus(journey)}
            className="px-4 py-2 rounded-xl bg-[#702C3B] hover:bg-[#8D4554] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:shadow"
          >
            <Activity className="w-3.5 h-3.5" />
            Track Bus
          </button>
        </div>
      </div>
    </div>
  );
};

// High-contrast badge for direct vs transfer journeys
