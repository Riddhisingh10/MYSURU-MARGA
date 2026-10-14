import { Coordinates } from '@/types/bus';

export const MYSURU_CENTER: Coordinates = {
  lat: 12.3051,
  lng: 76.6551,
};

export const MYSURU_BOUNDS = {
  north: 12.3900,
  south: 12.2200,
  east: 76.7300,
  west: 76.5700,
};

export const BRAND = {
  name: 'Mysuru Marga',
  tagline: 'Your City. Your Route. Your Journey.',
  kannadaTagline: 'ನಿಮ್ಮ ನಗರ. ನಿಮ್ಮ ಮಾರ್ಗ. ನಿಮ್ಮ ಪಯಣ.',
  demoNotice: 'DEMO MODE — Bus locations, routes and timings are simulated demonstration data and not live public transport information.',
  demoNoticeShort: 'DEMO TRACKING — Simulated data for Mysuru demonstration',
};

export const THEME = {
  creamBg: '#F7F1E7',
  ivoryCard: '#FFFCF7',
  maroonPrimary: '#702C3B',
  maroonSecondary: '#8D4554',
  charcoalMain: '#282321',
  brownMuted: '#776E68',
  beigeBorder: '#E5D8C8',
  greenSuccess: '#2D6A4F',
  amberWarning: '#B07D14',
};

export const SIMULATION_CONFIG = {
  defaultSpeedMultiplier: 1,
  updateIntervalMs: 1500, // Frequent smooth update
  averageBusSpeedKmH: 24, // Typical urban bus speed in Mysuru
};
