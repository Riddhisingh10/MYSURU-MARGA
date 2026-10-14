'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DemoNotice } from '@/components/common/DemoNotice';
import { MysuruMap } from '@/components/map/MysuruMap';
import { JourneySearchForm } from '@/components/journey/JourneySearchForm';
import { JourneyResultsList } from '@/components/journey/JourneyResultsList';
import { LiveTrackingPanel } from '@/components/tracking/LiveTrackingPanel';
import { RouteDirectory } from '@/components/routes/RouteDirectory';
import {
  BusRoute,
  BusStop,
  BusLiveLocation,
  JourneyOption,
  LocationSuggestion,
  Coordinates,
} from '@/types/bus';
import { routeService } from '@/services/RouteService';
import { mockBusLocationService } from '@/services/MockBusLocationService';
import { journeyPlannerService } from '@/services/JourneyPlannerService';
import { BRAND, MYSURU_CENTER } from '@/lib/constants';
import {
  Compass,
  Route as RouteIcon,
  Activity,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'plan' | 'routes' | 'track'>('plan');

  // Master data
  const [allRoutes, setAllRoutes] = useState<BusRoute[]>([]);
  const [allStops, setAllStops] = useState<BusStop[]>([]);
  const [allBuses, setAllBuses] = useState<BusLiveLocation[]>([]);

  // Journey state
  const [journeys, setJourneys] = useState<JourneyOption[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<JourneyOption | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<'fastest' | 'least_walking' | 'fewest_transfers' | 'earliest'>(
    'fastest'
  );

  // Map focus & highlights
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [selectedBus, setSelectedBus] = useState<BusLiveLocation | null>(null);
  const [boardingStop, setBoardingStop] = useState<BusStop | null>(null);
  const [destinationStop, setDestinationStop] = useState<BusStop | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState(0);

  // Simulation state
  const [simRunning, setSimRunning] = useState(true);

  // Mobile map view toggle
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  // Initialize master data
  useEffect(() => {
    Promise.all([routeService.getAllRoutes(), routeService.getAllStops()]).then(
      ([routesData, stopsData]) => {
        setAllRoutes(routesData);
        setAllStops(stopsData);

        // Preload an initial showcase route (Route 119 CBS to Chamundi Hill)
        const initialRoute = routesData.find((r) => r.id === 'route-119-up') || routesData[0];
        if (initialRoute) {
          setSelectedRoute(initialRoute);
        }
      }
    );

    // Subscribe to continuous live bus movements
    const unsubscribe = mockBusLocationService.subscribeToBusUpdates((buses) => {
      setAllBuses([...buses]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle Search Submission
  const handleSearch = async (
    origin: LocationSuggestion,
    destination: LocationSuggestion
  ) => {
    setIsSearching(true);
    setHasSearched(true);
    setSelectedJourney(null);

    try {
      const results = await journeyPlannerService.findJourneys({
        origin,
        destination,
        sortBy,
      });

      setJourneys(results);

      if (results.length > 0) {
        // Automatically highlight first route on map
        const first = results[0];
        handleViewRoute(first);
      }
    } catch (err) {
      console.error('Error finding journeys:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Re-sort journeys when sort filter changes
  const handleSortChange = async (newSort: typeof sortBy) => {
    setSortBy(newSort);
    if (journeys.length > 0) {
      // Re-sort locally
      const list = [...journeys];
      if (newSort === 'least_walking') {
        list.sort((a, b) => a.totalWalkingDistanceMeters - b.totalWalkingDistanceMeters);
      } else if (newSort === 'fewest_transfers') {
        list.sort((a, b) => (a.type === 'DIRECT' ? 0 : 1) - (b.type === 'DIRECT' ? 0 : 1));
      } else if (newSort === 'earliest') {
        list.sort(
          (a, b) =>
            a.estimatedArrivalAtBoardingMinutes - b.estimatedArrivalAtBoardingMinutes
        );
      } else {
        list.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
      }
      setJourneys(list);
    }
  };

  // "View Route" action
  const handleViewRoute = (journey: JourneyOption) => {
    setSelectedJourney(journey);
    setBoardingStop(journey.boardingStop);
    setDestinationStop(journey.destinationStop);

    const busLeg = journey.legs.find((l) => l.type === 'BUS_RIDE');
    if (busLeg?.busRoute) {
      setSelectedRoute(busLeg.busRoute);
    } else {
      const foundRoute = allRoutes.find((r) =>
        r.orderedStopIds.includes(journey.boardingStop.id) &&
        r.orderedStopIds.includes(journey.destinationStop.id)
      );
      if (foundRoute) setSelectedRoute(foundRoute);
    }

    if (journey.assignedBus) {
      setSelectedBus(journey.assignedBus);
    }

    setFitBoundsTrigger((prev) => prev + 1);
  };

  // "Track Bus" action
  const handleTrackBus = (journey: JourneyOption) => {
    handleViewRoute(journey);
    setActiveTab('track');
    setMobileView('map');
  };

  // Route Directory select route
  const handleSelectRouteFromDirectory = (route: BusRoute) => {
    setSelectedRoute(route);
    const firstStop = allStops.find((s) => s.id === route.orderedStopIds[0]);
    const lastStop = allStops.find(
      (s) => s.id === route.orderedStopIds[route.orderedStopIds.length - 1]
    );

    setBoardingStop(firstStop || null);
    setDestinationStop(lastStop || null);

    const liveBus = allBuses.find((b) => b.routeId === route.id);
    setSelectedBus(liveBus || null);

    setFitBoundsTrigger((prev) => prev + 1);
  };

  // Route Directory track route
  const handleTrackRouteFromDirectory = (route: BusRoute) => {
    handleSelectRouteFromDirectory(route);

    const firstStop = allStops.find((s) => s.id === route.orderedStopIds[0]);
    const lastStop = allStops.find(
      (s) => s.id === route.orderedStopIds[route.orderedStopIds.length - 1]
    );

    if (firstStop && lastStop) {
      const dummyJourney: JourneyOption = {
        id: `dir-track-${route.id}`,
        type: 'DIRECT',
        legs: [],
        totalDurationMinutes: route.approxDurationMinutes,
        totalWalkingDistanceMeters: 200,
        totalWalkingMinutes: 3,
        totalBusMinutes: route.approxDurationMinutes,
        departureTimeText: 'Now',
        arrivalTimeText: `+${route.approxDurationMinutes}m`,
        primaryRouteNumber: route.routeNumber,
        primaryDestination: route.destination,
        boardingStop: firstStop,
        destinationStop: lastStop,
        numberOfStops: route.stops.length,
        estimatedArrivalAtBoardingMinutes: 5,
        assignedBus: allBuses.find((b) => b.routeId === route.id),
      };
      setSelectedJourney(dummyJourney);
    }

    setActiveTab('track');
    setMobileView('map');
  };

  const toggleSimulation = () => {
    const nextState = !simRunning;
    mockBusLocationService.setSimulationRunning(nextState);
    setSimRunning(nextState);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E7]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'track' && !selectedJourney && journeys.length > 0) {
            handleViewRoute(journeys[0]);
          }
        }}
        simulationRunning={simRunning}
        onToggleSimulation={toggleSimulation}
      />

      {/* Demo Status Banner & Hardware Architecture Explainer */}
      <DemoNotice />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile View Toggle (List vs Map) */}
        <div className="md:hidden flex items-center justify-center mb-4">
          <div className="bg-[#FFFCF7] border border-[#E5D8C8] p-1 rounded-xl flex items-center shadow-xs">
            <button
              onClick={() => setMobileView('list')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mobileView === 'list'
                  ? 'bg-[#702C3B] text-white shadow-xs'
                  : 'text-[#776E68]'
              }`}
            >
              Planner & Details
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mobileView === 'map'
                  ? 'bg-[#702C3B] text-white shadow-xs'
                  : 'text-[#776E68]'
              }`}
            >
              Interactive Map ({allBuses.length} Buses)
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Journey Planner / Route Directory / Live Tracking */}
          <div
            className={`lg:col-span-5 xl:col-span-5 space-y-6 ${
              mobileView === 'map' ? 'hidden md:block' : 'block'
            }`}
          >
            {activeTab === 'plan' && (
              <div className="space-y-6">
                {/* Hero Headings */}
                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#282321]">
                    Where do you want to go?
                  </h1>
                  <p className="text-xs sm:text-sm text-[#776E68] font-medium leading-relaxed">
                    Find your bus, know when it arrives, and travel across Mysuru with confidence.
                  </p>
                </div>

                {/* Search Form */}
                <JourneySearchForm
                  onSearch={handleSearch}
                  isLoading={isSearching}
                  onUserLocationUpdate={(coords) => {
                    setUserLocation(coords);
                    setFitBoundsTrigger((prev) => prev + 1);
                  }}
                />

                {/* Results Section */}
                {hasSearched && (
                  <div className="space-y-4 pt-2">
                    <JourneyResultsList
                      journeys={journeys}
                      selectedJourneyId={selectedJourney?.id || null}
                      sortBy={sortBy}
                      onSortChange={handleSortChange}
                      onViewRoute={(j) => {
                        handleViewRoute(j);
                        setMobileView('map');
                      }}
                      onTrackBus={handleTrackBus}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Bus Routes Tab */}
            {activeTab === 'routes' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#282321]">
                    Mysuru Bus Routes Directory
                  </h2>
                  <p className="text-xs text-[#776E68] mt-1 font-medium">
                    Explore city bus routes, stops, and schedules connecting Mysuru landmarks.
                  </p>
                </div>

                <RouteDirectory
                  routes={allRoutes}
                  stops={allStops}
                  selectedRoute={selectedRoute}
                  onSelectRoute={(r) => {
                    handleSelectRouteFromDirectory(r);
                    setMobileView('map');
                  }}
                  onTrackRoute={handleTrackRouteFromDirectory}
                />
              </div>
            )}

            {/* Live Track Bus Tab */}
            {activeTab === 'track' && (
              <div>
                {selectedJourney && selectedRoute ? (
                  <LiveTrackingPanel
                    journey={selectedJourney}
                    route={selectedRoute}
                    allStops={allStops}
                    onBack={() => setActiveTab('plan')}
                    onRecenter={() => setFitBoundsTrigger((prev) => prev + 1)}
                  />
                ) : (
                  <div className="bg-[#FFFCF7] border border-[#E5D8C8] rounded-2xl p-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#702C3B]/10 text-[#702C3B] mx-auto flex items-center justify-center">
                      <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#282321]">
                      Select a Bus to Track
                    </h3>
                    <p className="text-xs text-[#776E68] max-w-sm mx-auto leading-relaxed">
                      Plan a journey or pick a route from the directory, then click <strong>Track Bus</strong> to monitor its live simulated progress along Mysuru roads.
                    </p>
                    <button
                      onClick={() => setActiveTab('plan')}
                      className="px-4 py-2 rounded-xl bg-[#702C3B] text-white text-xs font-bold hover:bg-[#8D4554] transition-colors"
                    >
                      Plan a Journey Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Interactive Mysuru Map */}
          <div
            className={`lg:col-span-7 xl:col-span-7 sticky top-24 ${
              mobileView === 'list' ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="bg-[#FFFCF7] border border-[#E5D8C8] rounded-2xl p-3 shadow-sm space-y-3">
              {/* Map Header Status */}
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F] animate-pulse" />
                  <span className="text-xs font-bold text-[#282321]">
                    Mysuru City Transit Map
                  </span>
                  {selectedRoute && (
                    <span className="text-xs text-[#702C3B] font-semibold hidden sm:inline">
                      • {selectedRoute.routeNumber} ({selectedRoute.origin} ➔ {selectedRoute.destination})
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-[#776E68] flex items-center gap-1 font-medium">
                  <Activity className="w-3.5 h-3.5 text-[#702C3B]" />
                  <span>{allBuses.length} Simulated Buses Active</span>
                </div>
              </div>

              {/* Leaflet Map Component */}
              <div className="h-[480px] sm:h-[580px] w-full rounded-xl overflow-hidden">
                <MysuruMap
                  buses={allBuses}
                  stops={allStops}
                  routes={allRoutes}
                  selectedRoute={selectedRoute}
                  selectedBus={selectedBus}
                  boardingStop={boardingStop}
                  destinationStop={destinationStop}
                  userLocation={userLocation}
                  fitBoundsTrigger={fitBoundsTrigger}
                  autoCenterOnBus={activeTab === 'track'}
                  onSelectBus={(bus) => {
                    setSelectedBus(bus);
                    const route = allRoutes.find((r) => r.id === bus.routeId);
                    if (route) setSelectedRoute(route);
                  }}
                  onSelectStop={(stop) => {
                    // Quick inspection of stop
                    setBoardingStop(stop);
                  }}
                />
              </div>

              {/* Map Footer Info */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-[#776E68] px-2 pb-1 gap-2">
                <div>
                  Center: <strong>Mysuru, Karnataka (12.3051° N, 76.6551° E)</strong>
                </div>
                <div className="text-[#702C3B] font-medium">
                  Click any bus or bus stop marker for details
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Mobile view toggle between list planner and interactive map
