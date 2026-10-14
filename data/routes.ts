import { BusRoute } from '@/types/bus';

export const MYSURU_ROUTES: BusRoute[] = [
  {
    id: 'route-119-up',
    routeNumber: 'Demo Route 119',
    routeName: 'City Bus Stand to Chamundi Hill Temple',
    origin: 'City Bus Stand (CBS)',
    destination: 'Chamundi Hill Temple (Sri Chamundeshwari)',
    direction: 'UP',
    approxDurationMinutes: 32,
    frequencyMinutes: 15,
    color: '#702C3B',
    isDemoRoute: true,
    orderedStopIds: [
      'stop-cbs',
      'stop-suburban',
      'stop-palace',
      'stop-zoo',
      'stop-chamundi-foot',
      'stop-chamundi-temple',
    ],
    stops: [
      { stopId: 'stop-cbs', stopSequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-suburban', stopSequence: 2, distanceFromStartKm: 1.1, scheduledMinutesFromStart: 5 },
      { stopId: 'stop-palace', stopSequence: 3, distanceFromStartKm: 2.2, scheduledMinutesFromStart: 10 },
      { stopId: 'stop-zoo', stopSequence: 4, distanceFromStartKm: 3.8, scheduledMinutesFromStart: 16 },
      { stopId: 'stop-chamundi-foot', stopSequence: 5, distanceFromStartKm: 6.2, scheduledMinutesFromStart: 23 },
      { stopId: 'stop-chamundi-temple', stopSequence: 6, distanceFromStartKm: 11.5, scheduledMinutesFromStart: 32 },
    ],
    polylineCoordinates: [
      { lat: 12.3086, lng: 76.6542 }, // CBS
      { lat: 12.3095, lng: 76.6560 }, // Sayyaji Rao Rd
      { lat: 12.3112, lng: 76.6578 },
      { lat: 12.3121, lng: 76.6589 }, // Suburban Stand
      { lat: 12.3090, lng: 76.6575 }, // Towards Palace
      { lat: 12.3065, lng: 76.6560 },
      { lat: 12.3051, lng: 76.6551 }, // Palace Varaha Gate
      { lat: 12.3040, lng: 76.6590 }, // Indiranagar Road
      { lat: 12.3030, lng: 76.6630 },
      { lat: 12.3023, lng: 76.6669 }, // Zoo
      { lat: 12.2980, lng: 76.6695 }, // Mysore Race Club
      { lat: 12.2930, lng: 76.6730 }, // Lalitha Mahal Road
      { lat: 12.2885, lng: 76.6760 },
      { lat: 12.2858, lng: 76.6780 }, // Chamundi Hill Foot (Tavarekatte)
      { lat: 12.2820, lng: 76.6765 }, // Hairpin Bend 1
      { lat: 12.2790, lng: 76.6740 }, // Hill curves
      { lat: 12.2765, lng: 76.6775 }, // Nandi Statue Turn
      { lat: 12.2750, lng: 76.6745 }, // Upper ascent
      { lat: 12.2748, lng: 76.6710 }, // Chamundi Hill Temple
    ],
  },
  {
    id: 'route-201-up',
    routeNumber: 'Demo Route 201',
    routeName: 'City Bus Stand to Kuvempunagar & Bogadi',
    origin: 'City Bus Stand (CBS)',
    destination: 'Bogadi 2nd Stage',
    direction: 'UP',
    approxDurationMinutes: 28,
    frequencyMinutes: 12,
    color: '#8D4554',
    isDemoRoute: true,
    orderedStopIds: [
      'stop-cbs',
      'stop-railway-station',
      'stop-saraswathipuram',
      'stop-ramaswamy',
      'stop-ballal',
      'stop-kuvempunagar',
      'stop-bogadi',
    ],
    stops: [
      { stopId: 'stop-cbs', stopSequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-railway-station', stopSequence: 2, distanceFromStartKm: 1.8, scheduledMinutesFromStart: 6 },
      { stopId: 'stop-saraswathipuram', stopSequence: 3, distanceFromStartKm: 3.5, scheduledMinutesFromStart: 12 },
      { stopId: 'stop-ramaswamy', stopSequence: 4, distanceFromStartKm: 4.8, scheduledMinutesFromStart: 16 },
      { stopId: 'stop-ballal', stopSequence: 5, distanceFromStartKm: 5.9, scheduledMinutesFromStart: 20 },
      { stopId: 'stop-kuvempunagar', stopSequence: 6, distanceFromStartKm: 7.6, scheduledMinutesFromStart: 24 },
      { stopId: 'stop-bogadi', stopSequence: 7, distanceFromStartKm: 9.8, scheduledMinutesFromStart: 28 },
    ],
    polylineCoordinates: [
      { lat: 12.3086, lng: 76.6542 }, // CBS
      { lat: 12.3120, lng: 76.6500 }, // KR Circle
      { lat: 12.3150, lng: 76.6455 }, // Station road
      { lat: 12.3158, lng: 76.6438 }, // Railway Station
      { lat: 12.3110, lng: 76.6380 }, // Vinoba Road
      { lat: 12.3060, lng: 76.6340 },
      { lat: 12.3038, lng: 76.6315 }, // Saraswathipuram Fire Brigade
      { lat: 12.3030, lng: 76.6375 }, // Towards Ramaswamy
      { lat: 12.3025, lng: 76.6430 }, // Ramaswamy Circle
      { lat: 12.2985, lng: 76.6432 }, // JLB Road
      { lat: 12.2952, lng: 76.6434 }, // Ballal Circle
      { lat: 12.2910, lng: 76.6380 }, // New Kantharaj Urs Road
      { lat: 12.2870, lng: 76.6310 },
      { lat: 12.2842, lng: 76.6268 }, // Kuvempunagar Complex
      { lat: 12.2870, lng: 76.6200 }, // Ring road approach
      { lat: 12.2930, lng: 76.6140 },
      { lat: 12.2980, lng: 76.6080 }, // Bogadi 2nd Stage
    ],
  },
  {
    id: 'route-303-up',
    routeNumber: 'Demo Route 303',
    routeName: 'City Bus Stand to Vijayanagar 4th Stage',
    origin: 'City Bus Stand (CBS)',
    destination: 'Vijayanagar 4th Stage',
    direction: 'UP',
    approxDurationMinutes: 26,
    frequencyMinutes: 10,
    color: '#702C3B',
    isDemoRoute: true,
    orderedStopIds: [
      'stop-cbs',
      'stop-vontikoppal',
      'stop-gokulam',
      'stop-vijayanagar-water-tank',
      'stop-vijayanagar-4th',
    ],
    stops: [
      { stopId: 'stop-cbs', stopSequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-vontikoppal', stopSequence: 2, distanceFromStartKm: 3.2, scheduledMinutesFromStart: 9 },
      { stopId: 'stop-gokulam', stopSequence: 3, distanceFromStartKm: 4.6, scheduledMinutesFromStart: 14 },
      { stopId: 'stop-vijayanagar-water-tank', stopSequence: 4, distanceFromStartKm: 6.8, scheduledMinutesFromStart: 20 },
      { stopId: 'stop-vijayanagar-4th', stopSequence: 5, distanceFromStartKm: 9.1, scheduledMinutesFromStart: 26 },
    ],
    polylineCoordinates: [
      { lat: 12.3086, lng: 76.6542 }, // CBS
      { lat: 12.3140, lng: 76.6490 }, // Irwin Road
      { lat: 12.3190, lng: 76.6420 }, // Kalidasa Road
      { lat: 12.3230, lng: 76.6375 },
      { lat: 12.3260, lng: 76.6345 }, // Vontikoppal
      { lat: 12.3285, lng: 76.6310 }, // Contour Rd
      { lat: 12.3312, lng: 76.6270 }, // Gokulam 3rd Stage
      { lat: 12.3300, lng: 76.6180 }, // Towards Vijayanagar
      { lat: 12.3285, lng: 76.6120 },
      { lat: 12.3275, lng: 76.6080 }, // Vijayanagar Water Tank
      { lat: 12.3330, lng: 76.6020 }, // High Tension Road
      { lat: 12.3380, lng: 76.5960 },
      { lat: 12.3410, lng: 76.5920 }, // Vijayanagar 4th Stage
    ],
  },
  {
    id: 'route-10A-up',
    routeNumber: 'Demo Route 10A',
    routeName: 'Railway Station to Infosys / Hebbal Industrial Area',
    origin: 'Mysuru Railway Station',
    destination: 'Infosys Mysore / Hebbal Industrial Area',
    direction: 'UP',
    approxDurationMinutes: 30,
    frequencyMinutes: 15,
    color: '#8D4554',
    isDemoRoute: true,
    orderedStopIds: [
      'stop-railway-station',
      'stop-cbs',
      'stop-vontikoppal',
      'stop-gokulam',
      'stop-vijayanagar-water-tank',
      'stop-infosys-hebbal',
    ],
    stops: [
      { stopId: 'stop-railway-station', stopSequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-cbs', stopSequence: 2, distanceFromStartKm: 1.8, scheduledMinutesFromStart: 6 },
      { stopId: 'stop-vontikoppal', stopSequence: 3, distanceFromStartKm: 5.0, scheduledMinutesFromStart: 14 },
      { stopId: 'stop-gokulam', stopSequence: 4, distanceFromStartKm: 6.4, scheduledMinutesFromStart: 18 },
      { stopId: 'stop-vijayanagar-water-tank', stopSequence: 5, distanceFromStartKm: 8.6, scheduledMinutesFromStart: 24 },
      { stopId: 'stop-infosys-hebbal', stopSequence: 6, distanceFromStartKm: 13.2, scheduledMinutesFromStart: 30 },
    ],
    polylineCoordinates: [
      { lat: 12.3158, lng: 76.6438 }, // Railway Station
      { lat: 12.3120, lng: 76.6500 }, // KR Circle
      { lat: 12.3086, lng: 76.6542 }, // CBS
      { lat: 12.3140, lng: 76.6490 }, // Sayyaji Rao Rd / Irwin Rd
      { lat: 12.3200, lng: 76.6410 }, // Kalidasa Rd
      { lat: 12.3260, lng: 76.6345 }, // Vontikoppal
      { lat: 12.3312, lng: 76.6270 }, // Gokulam
      { lat: 12.3275, lng: 76.6080 }, // Vijayanagar Water Tank
      { lat: 12.3400, lng: 76.6040 }, // Outer Ring Road Hebbal
      { lat: 12.3520, lng: 76.5990 }, // Industrial Main Road
      { lat: 12.3615, lng: 76.5940 }, // Infosys Mysore
    ],
  },
  {
    id: 'route-135-up',
    routeNumber: 'Demo Route 135',
    routeName: 'Bannimantap to J.P. Nagar (North-South Cross City)',
    origin: 'Bannimantap Parade Ground',
    destination: 'J.P. Nagar (Goblimara)',
    direction: 'UP',
    approxDurationMinutes: 34,
    frequencyMinutes: 20,
    color: '#702C3B',
    isDemoRoute: true,
    orderedStopIds: [
      'stop-bannimantap',
      'stop-suburban',
      'stop-cbs',
      'stop-palace',
      'stop-zoo',
      'stop-vidyaranyapuram',
      'stop-jp-nagar',
    ],
    stops: [
      { stopId: 'stop-bannimantap', stopSequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-suburban', stopSequence: 2, distanceFromStartKm: 2.8, scheduledMinutesFromStart: 8 },
      { stopId: 'stop-cbs', stopSequence: 3, distanceFromStartKm: 3.9, scheduledMinutesFromStart: 12 },
      { stopId: 'stop-palace', stopSequence: 4, distanceFromStartKm: 5.1, scheduledMinutesFromStart: 16 },
      { stopId: 'stop-zoo', stopSequence: 5, distanceFromStartKm: 6.7, scheduledMinutesFromStart: 21 },
      { stopId: 'stop-vidyaranyapuram', stopSequence: 6, distanceFromStartKm: 9.8, scheduledMinutesFromStart: 28 },
      { stopId: 'stop-jp-nagar', stopSequence: 7, distanceFromStartKm: 12.1, scheduledMinutesFromStart: 34 },
    ],
    polylineCoordinates: [
      { lat: 12.3350, lng: 76.6520 }, // Bannimantap
      { lat: 12.3260, lng: 76.6545 }, // Highway Road
      { lat: 12.3180, lng: 76.6565 }, // Five Lights Circle
      { lat: 12.3121, lng: 76.6589 }, // Suburban Stand
      { lat: 12.3086, lng: 76.6542 }, // CBS
      { lat: 12.3051, lng: 76.6551 }, // Mysore Palace
      { lat: 12.3023, lng: 76.6669 }, // Zoo
      { lat: 12.2930, lng: 76.6580 }, // Vidyaranyapuram Approach
      { lat: 12.2820, lng: 76.6465 }, // Vidyaranyapuram Depot
      { lat: 12.2740, lng: 76.6440 }, // Sewage Farm Road
      { lat: 12.2680, lng: 76.6420 }, // JP Nagar
    ],
  },
  {
    id: 'route-62-up',
    routeNumber: 'Demo Route 62',
    routeName: 'City Bus Stand to Kuvempunagar (Via Ramaswamy)',
    origin: 'City Bus Stand (CBS)',
    destination: 'Kuvempunagar Complex',
    direction: 'UP',
    approxDurationMinutes: 18,
    frequencyMinutes: 10,
    color: '#8D4554',
    isDemoRoute: true,
    orderedStopIds: [
      'stop-cbs',
      'stop-palace',
      'stop-ramaswamy',
      'stop-ballal',
      'stop-saraswathipuram',
      'stop-kuvempunagar',
    ],
    stops: [
      { stopId: 'stop-cbs', stopSequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-palace', stopSequence: 2, distanceFromStartKm: 1.1, scheduledMinutesFromStart: 4 },
      { stopId: 'stop-ramaswamy', stopSequence: 3, distanceFromStartKm: 2.6, scheduledMinutesFromStart: 8 },
      { stopId: 'stop-ballal', stopSequence: 4, distanceFromStartKm: 3.8, scheduledMinutesFromStart: 11 },
      { stopId: 'stop-saraswathipuram', stopSequence: 5, distanceFromStartKm: 4.9, scheduledMinutesFromStart: 14 },
      { stopId: 'stop-kuvempunagar', stopSequence: 6, distanceFromStartKm: 6.2, scheduledMinutesFromStart: 18 },
    ],
    polylineCoordinates: [
      { lat: 12.3086, lng: 76.6542 }, // CBS
      { lat: 12.3051, lng: 76.6551 }, // Mysore Palace
      { lat: 12.3038, lng: 76.6480 }, // Chamaraja Double Rd
      { lat: 12.3025, lng: 76.6430 }, // Ramaswamy Circle
      { lat: 12.2952, lng: 76.6434 }, // Ballal Circle
      { lat: 12.3038, lng: 76.6315 }, // Saraswathipuram
      { lat: 12.2900, lng: 76.6290 }, // Kuvempunagar Main Road
      { lat: 12.2842, lng: 76.6268 }, // Kuvempunagar Complex
    ],
  },
];

// Route 119 follows historical Maharaja procession route to Chamundi Foothills
