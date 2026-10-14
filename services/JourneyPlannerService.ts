import {
  JourneyOption,
  JourneySearchQuery,
  BusStop,
  BusRoute,
  JourneyLeg,
} from '@/types/bus';
import { IJourneyPlannerService } from './types';
import { locationSearchService } from './LocationSearchService';
import { routeService } from './RouteService';
import { scheduleService } from './ScheduleService';
import { mockBusLocationService } from './MockBusLocationService';
import { getDistanceMeters, estimateWalkMinutes } from '@/lib/geo';
import { formatTime12h, calculateFutureClockTime } from '@/lib/time';

export class JourneyPlannerService implements IJourneyPlannerService {
  async findJourneys(query: JourneySearchQuery): Promise<JourneyOption[]> {
    const { origin, destination, sortBy = 'fastest' } = query;

    // 1. Find boarding stops near origin
    const boardingStops = await locationSearchService.getNearbyStops(
      origin.coordinates,
      1800
    );

    // 2. Find alight stops near destination
    const destinationStops = await locationSearchService.getNearbyStops(
      destination.coordinates,
      1800
    );

    const allRoutes = await routeService.getAllRoutes();
    const journeys: JourneyOption[] = [];

    // 3. Match DIRECT journeys
    for (const bStop of boardingStops) {
      for (const dStop of destinationStops) {
        if (bStop.id === dStop.id) continue;

        for (const route of allRoutes) {
          const bIndex = route.orderedStopIds.indexOf(bStop.id);
          const dIndex = route.orderedStopIds.indexOf(dStop.id);

          // Route must serve both stops AND bStop must be before dStop (correct direction!)
          if (bIndex !== -1 && dIndex !== -1 && bIndex < dIndex) {
            const journey = await this.buildDirectJourney(
              origin,
              destination,
              bStop,
              dStop,
              route,
              bIndex,
              dIndex
            );
            if (journey) {
              journeys.push(journey);
            }
          }
        }
      }
    }

    // 4. If fewer than 2 direct journeys, search for ONE-TRANSFER journeys
    if (journeys.length < 2) {
      const transferJourneys = await this.findTransferJourneys(
        origin,
        destination,
        boardingStops,
        destinationStops,
        allRoutes
      );
      journeys.push(...transferJourneys);
    }

    // 5. Rank & Sort options
    return this.sortJourneys(journeys, sortBy);
  }

  private async buildDirectJourney(
    origin: JourneySearchQuery['origin'],
    destination: JourneySearchQuery['destination'],
    boardingStop: BusStop,
    destinationStop: BusStop,
    route: BusRoute,
    bIndex: number,
    dIndex: number
  ): Promise<JourneyOption | null> {
    const walkToBoardingMeters = Math.round(
      getDistanceMeters(origin.coordinates, boardingStop.coordinates)
    );
    const walkToBoardingMinutes = estimateWalkMinutes(walkToBoardingMeters);

    const walkToDestMeters = Math.round(
      getDistanceMeters(destinationStop.coordinates, destination.coordinates)
    );
    const walkToDestMinutes = estimateWalkMinutes(walkToDestMeters);

    // Stops count along route
    const stopsCount = dIndex - bIndex;

    // Calculate in-bus duration from route stop details
    const bStopDetail = route.stops.find((s) => s.stopId === boardingStop.id);
    const dStopDetail = route.stops.find((s) => s.stopId === destinationStop.id);
    let busMinutes = 15;
    if (bStopDetail && dStopDetail) {
      busMinutes = Math.max(
        5,
        dStopDetail.scheduledMinutesFromStart - bStopDetail.scheduledMinutesFromStart
      );
    } else {
      busMinutes = stopsCount * 4;
    }

    // Get live bus if available
    const liveBuses = await mockBusLocationService.getBusesByRoute(route.id);
    const assignedBus = liveBuses[0] || null;

    let etaAtBoardingMinutes = 6;
    if (assignedBus) {
      etaAtBoardingMinutes = await mockBusLocationService.calculateEtaToStop(
        assignedBus.busId,
        boardingStop.id
      );
    }

    // Get scheduled departure
    const scheduledTime = await scheduleService.getNextScheduledDeparture(
      route.id,
      boardingStop.id
    );

    const totalDurationMinutes =
      walkToBoardingMinutes + Math.max(etaAtBoardingMinutes, 3) + busMinutes + walkToDestMinutes;

    const departureTimeText = calculateFutureClockTime(walkToBoardingMinutes);
    const arrivalTimeText = calculateFutureClockTime(totalDurationMinutes);

    const legs: JourneyLeg[] = [
      {
        type: 'WALK_TO_STOP',
        fromName: origin.name,
        toName: boardingStop.name,
        fromCoords: origin.coordinates,
        toCoords: boardingStop.coordinates,
        distanceMeters: walkToBoardingMeters,
        durationMinutes: walkToBoardingMinutes,
      },
      {
        type: 'BUS_RIDE',
        fromName: boardingStop.name,
        toName: destinationStop.name,
        fromCoords: boardingStop.coordinates,
        toCoords: destinationStop.coordinates,
        distanceMeters: stopsCount * 1200,
        durationMinutes: busMinutes,
        busRoute: route,
        boardingStop,
        destinationStop,
        scheduledDepartureTime: scheduledTime || '10:30 AM',
        estimatedArrivalMinutes: etaAtBoardingMinutes,
        stopsCount,
        busId: assignedBus?.busId,
      },
      {
        type: 'WALK_TO_DESTINATION',
        fromName: destinationStop.name,
        toName: destination.name,
        fromCoords: destinationStop.coordinates,
        toCoords: destination.coordinates,
        distanceMeters: walkToDestMeters,
        durationMinutes: walkToDestMinutes,
      },
    ];

    return {
      id: `journey-${route.id}-${boardingStop.id}-${destinationStop.id}`,
      type: 'DIRECT',
      legs,
      totalDurationMinutes,
      totalWalkingDistanceMeters: walkToBoardingMeters + walkToDestMeters,
      totalWalkingMinutes: walkToBoardingMinutes + walkToDestMinutes,
      totalBusMinutes: busMinutes,
      departureTimeText,
      arrivalTimeText,
      primaryRouteNumber: route.routeNumber,
      primaryDestination: route.destination,
      boardingStop,
      destinationStop,
      numberOfStops: stopsCount,
      estimatedArrivalAtBoardingMinutes: etaAtBoardingMinutes,
      assignedBus: assignedBus || undefined,
    };
  }

  private async findTransferJourneys(
    origin: JourneySearchQuery['origin'],
    destination: JourneySearchQuery['destination'],
    boardingStops: BusStop[],
    destinationStops: BusStop[],
    allRoutes: BusRoute[]
  ): Promise<JourneyOption[]> {
    const results: JourneyOption[] = [];
    const majorTransferStops = ['stop-cbs', 'stop-suburban', 'stop-ramaswamy'];

    for (const bStop of boardingStops) {
      for (const tStopId of majorTransferStops) {
        if (bStop.id === tStopId) continue;

        // Route 1: bStop -> tStopId
        const r1 = allRoutes.find((r) => {
          const bIdx = r.orderedStopIds.indexOf(bStop.id);
          const tIdx = r.orderedStopIds.indexOf(tStopId);
          return bIdx !== -1 && tIdx !== -1 && bIdx < tIdx;
        });

        if (!r1) continue;

        // Route 2: tStopId -> dStop
        for (const dStop of destinationStops) {
          if (dStop.id === tStopId) continue;

          const r2 = allRoutes.find((r) => {
            const tIdx = r.orderedStopIds.indexOf(tStopId);
            const dIdx = r.orderedStopIds.indexOf(dStop.id);
            return tIdx !== -1 && dIdx !== -1 && tIdx < dIdx && r.id !== r1.id;
          });

          if (!r2) continue;

          const tStop = boardingStops.find((s) => s.id === tStopId) ||
            destinationStops.find((s) => s.id === tStopId);

          const walk1Meters = Math.round(
            getDistanceMeters(origin.coordinates, bStop.coordinates)
          );
          const walk1Min = estimateWalkMinutes(walk1Meters);

          const walkDestMeters = Math.round(
            getDistanceMeters(dStop.coordinates, destination.coordinates)
          );
          const walkDestMin = estimateWalkMinutes(walkDestMeters);

          const totalBusMin = 36;
          const totalDuration = walk1Min + totalBusMin + 8 + walkDestMin; // 8 min transfer buffer

          results.push({
            id: `transfer-${r1.id}-${r2.id}`,
            type: 'ONE_TRANSFER',
            legs: [],
            totalDurationMinutes: totalDuration,
            totalWalkingDistanceMeters: walk1Meters + walkDestMeters + 100,
            totalWalkingMinutes: walk1Min + walkDestMin + 2,
            totalBusMinutes: totalBusMin,
            departureTimeText: formatTime12h(new Date()),
            arrivalTimeText: calculateFutureClockTime(totalDuration),
            primaryRouteNumber: `${r1.routeNumber} ➔ ${r2.routeNumber}`,
            primaryDestination: `${dStop.name} (via ${tStop?.name || 'City Bus Stand'})`,
            boardingStop: bStop,
            destinationStop: dStop,
            transferStop: tStop,
            numberOfStops: 8,
            estimatedArrivalAtBoardingMinutes: 5,
          });

          if (results.length >= 2) return results;
        }
      }
    }

    return results;
  }

  private sortJourneys(
    journeys: JourneyOption[],
    sortBy: JourneySearchQuery['sortBy']
  ): JourneyOption[] {
    const list = [...journeys];
    switch (sortBy) {
      case 'least_walking':
        return list.sort(
          (a, b) => a.totalWalkingDistanceMeters - b.totalWalkingDistanceMeters
        );
      case 'fewest_transfers':
        return list.sort((a, b) => {
          const aTransfers = a.type === 'DIRECT' ? 0 : 1;
          const bTransfers = b.type === 'DIRECT' ? 0 : 1;
          return aTransfers - bTransfers;
        });
      case 'earliest':
        return list.sort(
          (a, b) =>
            a.estimatedArrivalAtBoardingMinutes - b.estimatedArrivalAtBoardingMinutes
        );
      case 'fastest':
      default:
        return list.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
    }
  }
}

export const journeyPlannerService = new JourneyPlannerService();

// Search radius for boarding stop discovery: 1800 meters

// Transfer buffer allowance: 8 minutes
