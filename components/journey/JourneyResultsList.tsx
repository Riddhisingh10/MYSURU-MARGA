'use client';

import React from 'react';
import { JourneyOption } from '@/types/bus';
import { JourneyResultCard } from './JourneyResultCard';
import { SlidersHorizontal, AlertCircle, Compass, Sparkles } from 'lucide-react';

interface JourneyResultsListProps {
  journeys: JourneyOption[];
  selectedJourneyId: string | null;
  sortBy: 'fastest' | 'least_walking' | 'fewest_transfers' | 'earliest';
  onSortChange: (sort: 'fastest' | 'least_walking' | 'fewest_transfers' | 'earliest') => void;
  onViewRoute: (journey: JourneyOption) => void;
  onTrackBus: (journey: JourneyOption) => void;
}

export const JourneyResultsList: React.FC<JourneyResultsListProps> = ({
  journeys,
  selectedJourneyId,
  sortBy,
  onSortChange,
  onViewRoute,
  onTrackBus,
}) => {
  if (journeys.length === 0) {
    return (
      <div className="bg-[#FFFCF7] border border-[#E5D8C8] rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#702C3B]/10 text-[#702C3B] mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-[#282321]">
          No Direct Bus Journey Found
        </h4>
        <p className="text-xs text-[#776E68] max-w-md mx-auto leading-relaxed">
          We couldn’t find a direct route between these two locations within walking distance. Try selecting one of the popular central stops like <strong>City Bus Stand (CBS)</strong> or <strong>Mysuru Railway Station</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Sorting bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFCF7] border border-[#E5D8C8] rounded-xl px-4 py-2.5">
        <div className="text-xs font-semibold text-[#282321]">
          <span>{journeys.length} Suitable Journey Option{journeys.length > 1 ? 's' : ''} Found</span>
        </div>

        {/* Sort filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-[#776E68] text-[11px] font-medium mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-[#702C3B]" /> Sort:
          </span>
          <button
            onClick={() => onSortChange('fastest')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              sortBy === 'fastest'
                ? 'bg-[#702C3B] text-white shadow-xs'
                : 'text-[#776E68] hover:bg-[#F7F1E7] hover:text-[#282321]'
            }`}
          >
            Fastest
          </button>
          <button
            onClick={() => onSortChange('least_walking')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              sortBy === 'least_walking'
                ? 'bg-[#702C3B] text-white shadow-xs'
                : 'text-[#776E68] hover:bg-[#F7F1E7] hover:text-[#282321]'
            }`}
          >
            Least Walking
          </button>
          <button
            onClick={() => onSortChange('fewest_transfers')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              sortBy === 'fewest_transfers'
                ? 'bg-[#702C3B] text-white shadow-xs'
                : 'text-[#776E68] hover:bg-[#F7F1E7] hover:text-[#282321]'
            }`}
          >
            Direct First
          </button>
          <button
            onClick={() => onSortChange('earliest')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              sortBy === 'earliest'
                ? 'bg-[#702C3B] text-white shadow-xs'
                : 'text-[#776E68] hover:bg-[#F7F1E7] hover:text-[#282321]'
            }`}
          >
            Earliest Arrival
          </button>
        </div>
      </div>

      {/* Journey Cards */}
      <div className="space-y-4">
        {journeys.map((journey) => (
          <JourneyResultCard
            key={journey.id}
            journey={journey}
            isSelected={selectedJourneyId === journey.id}
            onViewRoute={onViewRoute}
            onTrackBus={onTrackBus}
          />
        ))}
      </div>
    </div>
  );
};
