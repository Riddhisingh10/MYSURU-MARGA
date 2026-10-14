'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  ArrowUpDown,
  Search,
  X,
  Compass,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { LocationSuggestion, Coordinates } from '@/types/bus';
import { locationSearchService } from '@/services/LocationSearchService';

interface JourneySearchFormProps {
  onSearch: (origin: LocationSuggestion, destination: LocationSuggestion) => void;
  isLoading?: boolean;
  onUserLocationUpdate?: (coords: Coordinates) => void;
}

export const JourneySearchForm: React.FC<JourneySearchFormProps> = ({
  onSearch,
  isLoading = false,
  onUserLocationUpdate,
}) => {
  const [originInput, setOriginInput] = useState('');
  const [destInput, setDestInput] = useState('');

  const [selectedOrigin, setSelectedOrigin] = useState<LocationSuggestion | null>(null);
  const [selectedDest, setSelectedDest] = useState<LocationSuggestion | null>(null);

  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);

  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [isSearchingDest, setIsSearchingDest] = useState(false);

  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [geoLoading, setGeoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const originDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const destDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const popularDestinations = locationSearchService.getPopularDestinations();

  // Search origin autocomplete with debounce
  useEffect(() => {
    if (selectedOrigin && selectedOrigin.name === originInput) return;
    if (originInput.trim().length < 2) {
      setOriginSuggestions([]);
      return;
    }

    if (originDebounceRef.current) clearTimeout(originDebounceRef.current);
    setIsSearchingOrigin(true);

    originDebounceRef.current = setTimeout(async () => {
      try {
        const results = await locationSearchService.searchLocations(originInput);
        setOriginSuggestions(results);
        setShowOriginDropdown(true);
      } catch {
        setOriginSuggestions([]);
      } finally {
        setIsSearchingOrigin(false);
      }
    }, 280);

    return () => {
      if (originDebounceRef.current) clearTimeout(originDebounceRef.current);
    };
  }, [originInput, selectedOrigin]);

  // Search destination autocomplete with debounce
  useEffect(() => {
    if (selectedDest && selectedDest.name === destInput) return;
    if (destInput.trim().length < 2) {
      setDestSuggestions([]);
      return;
    }

    if (destDebounceRef.current) clearTimeout(destDebounceRef.current);
    setIsSearchingDest(true);

    destDebounceRef.current = setTimeout(async () => {
      try {
        const results = await locationSearchService.searchLocations(destInput);
        setDestSuggestions(results);
        setShowDestDropdown(true);
      } catch {
        setDestSuggestions([]);
      } finally {
        setIsSearchingDest(false);
      }
    }, 280);

    return () => {
      if (destDebounceRef.current) clearTimeout(destDebounceRef.current);
    };
  }, [destInput, selectedDest]);

  // Handle "Use my current location"
  const handleUseCurrentLocation = async () => {
    setGeoLoading(true);
    setErrorMessage(null);

    try {
      const coords = await locationSearchService.getCurrentPosition();
      onUserLocationUpdate?.(coords);

      const userLoc: LocationSuggestion = {
        id: 'user-current-loc',
        name: 'My Current Location',
        description: `Near Mysuru (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`,
        coordinates: coords,
        type: 'user_location',
      };

      setSelectedOrigin(userLoc);
      setOriginInput('My Current Location');
      setShowOriginDropdown(false);
    } catch (err: any) {
      console.warn('Geolocation error:', err);
      if (err.code === 1) {
        setErrorMessage(
          'Location permission was denied. You can still type any Mysuru landmark or choose an example below.'
        );
      } else {
        setErrorMessage(
          'Unable to acquire current location. Please select a Mysuru landmark or bus stop.'
        );
      }
    } finally {
      setGeoLoading(false);
    }
  };

  // Swap origin and destination
  const handleSwap = () => {
    const tempInput = originInput;
    const tempSelected = selectedOrigin;

    setOriginInput(destInput);
    setSelectedOrigin(selectedDest);

    setDestInput(tempInput);
    setSelectedDest(tempSelected);
  };

  // Quick select an example journey
  const handleSelectExample = (dest: LocationSuggestion) => {
    // If no origin, default to City Bus Stand
    if (!selectedOrigin) {
      const cbs = locationSearchService.getPopularDestinations().find((d) => d.id === 'lm-cbs') || {
        id: 'lm-cbs',
        name: 'City Bus Stand (CBS)',
        description: 'Central Terminal, Sayyaji Rao Rd',
        coordinates: { lat: 12.3086, lng: 76.6542 },
        type: 'stop',
      };
      setSelectedOrigin(cbs);
      setOriginInput(cbs.name);
    }

    setSelectedDest(dest);
    setDestInput(dest.name);
    setErrorMessage(null);

    // Auto submit
    const currentOrigin = selectedOrigin || {
      id: 'lm-cbs',
      name: 'City Bus Stand (CBS)',
      description: 'Central Terminal, Sayyaji Rao Rd',
      coordinates: { lat: 12.3086, lng: 76.6542 },
      type: 'stop',
    };
    onSearch(currentOrigin, dest);
  };

  // Handle Search Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedOrigin && !originInput.trim()) {
      setErrorMessage('Please enter your starting location.');
      return;
    }

    if (!selectedDest && !destInput.trim()) {
      setErrorMessage('Please enter your destination in Mysuru.');
      return;
    }

    // Resolve unselected text input
    let finalOrigin = selectedOrigin;
    if (!finalOrigin) {
      finalOrigin = {
        id: 'custom-origin',
        name: originInput.trim(),
        description: 'Selected location',
        coordinates: { lat: 12.3086, lng: 76.6542 }, // fallback to CBS
        type: 'place',
      };
    }

    let finalDest = selectedDest;
    if (!finalDest) {
      finalDest = {
        id: 'custom-dest',
        name: destInput.trim(),
        description: 'Selected destination',
        coordinates: { lat: 12.3051, lng: 76.6551 }, // fallback to Palace
        type: 'place',
      };
    }

    onSearch(finalOrigin, finalDest);
  };

  return (
    <div className="bg-[#FFFCF7] border border-[#E5D8C8] rounded-2xl p-5 sm:p-7 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Origin Input */}
        <div className="relative">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#776E68] mb-1.5">
            From (Starting Location)
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[#702C3B]">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={originInput}
              onChange={(e) => {
                setOriginInput(e.target.value);
                setSelectedOrigin(null);
              }}
              onFocus={() => {
                if (originSuggestions.length > 0) setShowOriginDropdown(true);
              }}
              placeholder="Enter current location, landmark, or stop..."
              className="w-full pl-11 pr-24 py-3 bg-[#F7F1E7]/70 border border-[#E5D8C8] rounded-xl text-sm font-medium text-[#282321] placeholder-[#776E68]/70 focus:outline-none focus:ring-2 focus:ring-[#702C3B] focus:bg-white transition-all"
            />

            <div className="absolute right-2.5 flex items-center gap-1">
              {isSearchingOrigin && (
                <Loader2 className="w-4 h-4 animate-spin text-[#702C3B]" />
              )}
              {selectedOrigin?.type === 'user_location' && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3" /> GPS
                </span>
              )}
              {originInput && (
                <button
                  type="button"
                  onClick={() => {
                    setOriginInput('');
                    setSelectedOrigin(null);
                  }}
                  className="p-1 text-[#776E68] hover:text-[#282321] rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Autocomplete dropdown for Origin */}
          {showOriginDropdown && originSuggestions.length > 0 && (
            <div className="absolute z-30 left-0 right-0 mt-1 bg-[#FFFCF7] border border-[#E5D8C8] rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {originSuggestions.map((sugg) => (
                <div
                  key={sugg.id}
                  onClick={() => {
                    setSelectedOrigin(sugg);
                    setOriginInput(sugg.name);
                    setShowOriginDropdown(false);
                  }}
                  className="px-4 py-2.5 hover:bg-[#F7F1E7] cursor-pointer border-b border-[#E5D8C8]/40 last:border-0 flex items-start gap-2.5 text-xs transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#702C3B] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-[#282321]">{sugg.name}</div>
                    <div className="text-[11px] text-[#776E68]">{sugg.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* "Use my current location" Action */}
          <div className="mt-1.5 flex justify-end">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#702C3B] hover:text-[#8D4554] hover:underline focus:outline-none transition-colors"
            >
              {geoLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Detecting location...
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  Use my current location
                </>
              )}
            </button>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap origin and destination"
            className="p-2 rounded-full border border-[#E5D8C8] bg-[#FFFCF7] text-[#702C3B] shadow-sm hover:bg-[#F7F1E7] hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Input */}
        <div className="relative">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#776E68] mb-1.5">
            To (Destination)
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[#702C3B]">
              <Compass className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={destInput}
              onChange={(e) => {
                setDestInput(e.target.value);
                setSelectedDest(null);
              }}
              onFocus={() => {
                if (destSuggestions.length > 0) setShowDestDropdown(true);
              }}
              placeholder="Where do you want to go in Mysuru?"
              className="w-full pl-11 pr-20 py-3 bg-[#F7F1E7]/70 border border-[#E5D8C8] rounded-xl text-sm font-medium text-[#282321] placeholder-[#776E68]/70 focus:outline-none focus:ring-2 focus:ring-[#702C3B] focus:bg-white transition-all"
            />

            <div className="absolute right-2.5 flex items-center gap-1">
              {isSearchingDest && (
                <Loader2 className="w-4 h-4 animate-spin text-[#702C3B]" />
              )}
              {destInput && (
                <button
                  type="button"
                  onClick={() => {
                    setDestInput('');
                    setSelectedDest(null);
                  }}
                  className="p-1 text-[#776E68] hover:text-[#282321] rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Autocomplete dropdown for Destination */}
          {showDestDropdown && destSuggestions.length > 0 && (
            <div className="absolute z-30 left-0 right-0 mt-1 bg-[#FFFCF7] border border-[#E5D8C8] rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {destSuggestions.map((sugg) => (
                <div
                  key={sugg.id}
                  onClick={() => {
                    setSelectedDest(sugg);
                    setDestInput(sugg.name);
                    setShowDestDropdown(false);
                  }}
                  className="px-4 py-2.5 hover:bg-[#F7F1E7] cursor-pointer border-b border-[#E5D8C8]/40 last:border-0 flex items-start gap-2.5 text-xs transition-colors"
                >
                  <Compass className="w-4 h-4 text-[#702C3B] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-[#282321]">{sugg.name}</div>
                    <div className="text-[11px] text-[#776E68]">{sugg.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#B07D14] flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-[#702C3B] hover:bg-[#8D4554] active:bg-[#501E29] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Calculating journeys...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Find My Bus
            </>
          )}
        </button>

        {/* Quick Test Demo Destinations */}
        <div className="pt-3 border-t border-[#E5D8C8]/60">
          <div className="flex items-center gap-1.5 text-xs text-[#776E68] font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#702C3B]" />
            <span>Popular Mysuru Destinations (1-Click Test):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {popularDestinations.map((dest) => (
              <button
                key={dest.id}
                type="button"
                onClick={() => handleSelectExample(dest)}
                className="px-2.5 py-1 rounded-lg border border-[#E5D8C8] bg-[#F7F1E7]/80 hover:bg-[#702C3B] hover:text-white hover:border-[#702C3B] text-xs font-medium text-[#282321] transition-all"
              >
                {dest.name.replace(/\(.*?\)/g, '').trim()}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

// Keyboard navigation support for autocomplete list
