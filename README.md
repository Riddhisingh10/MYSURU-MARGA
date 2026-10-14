# Mysuru Marga (ಮೈಸೂರು ಮಾರ್ಗ)
### Smart City Bus Journey Planner & Real-Time Bus Tracking Platform
**"Your City. Your Route. Your Journey." | "ನಿಮ್ಮ ನಗರ. ನಿಮ್ಮ ಮಾರ್ಗ. ನಿಮ್ಮ ಪಯಣ."**

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-green?logo=leaflet)](https://leafletjs.com/)

---

## 1. Product Overview

**Mysuru Marga** is a public-facing urban transit web application designed for passengers traveling across the historic heritage city of **Mysuru, Karnataka, India**.

The platform is designed to answer four fundamental transit questions:
1. **Where is the nearest suitable bus stop?**
2. **Which bus route should I board to reach my destination?**
3. **At what time will that bus arrive?**
4. **Where is my bus right now, and how long until it reaches my stop?**

```
Passenger Journey Flow:
[Starting Location] ➔ [Destination] ➔ [Find My Bus] ➔ [Compare Journeys] ➔ [Select Route] ➔ [Track Live Bus] ➔ [Board on Time]
```

---

## 2. UI / UX Design System

The application features a warm, elegant **cream-major and maroon-minor** palette inspired by Mysuru's heritage architectural aesthetic:

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Primary Background** | `#F7F1E7` | Warm cream base occupying the majority of the interface |
| **Card Background** | `#FFFCF7` | Soft ivory for elevation and cards |
| **Primary Accent** | `#702C3B` | Deep royal maroon for primary CTAs, active route highlights |
| **Secondary Accent** | `#8D4554` | Lighter maroon for hover states, badges, secondary buttons |
| **Main Text** | `#282321` | Dark charcoal for high contrast, accessible typography |
| **Muted Text** | `#776E68` | Muted brown for secondary metadata and timestamps |
| **Borders** | `#E5D8C8` | Warm beige for clean, subtle division |
| **Live Success** | `#2D6A4F` | Restrained green for active buses, GPS, and approaching indicators |
| **Warning / Demo** | `#B07D14` | Muted amber for demo badges and transfer warnings |

---

## 3. Core Features

### 📍 Intelligent Journey Planning Engine
- **Nearby Stop Discovery:** Calculates walking distance and walking times to the closest bus stops within a configurable radius.
- **Route Matching:** Direct routes and 1-transfer journeys verified in the correct travel direction.
- **Multi-Criteria Ranking:** Sort journey options by:
  - Fastest total journey duration
  - Least walking distance
  - Direct journeys first (fewest transfers)
  - Earliest bus departure

### 🗺️ Interactive Mysuru Map
- Centered on Mysuru, Karnataka (`12.3051° N, 76.6551° E`).
- OpenStreetMap tiles with custom-styled Leaflet controls.
- Road-following route geometry along Sayyaji Rao Road, KRS Road, Chamundi Hill Road, and Outer Ring Road.
- Moving bus markers displaying real-time speed, heading degrees, and route numbers.
- Boarding stop (**B**) and destination stop (**D**) indicators with pulse animations.
- Interactive bus and stop popups with full stop metadata and timetables.

### ⏱️ Live Bus Simulation & Tracking
- Dedicated **Track Bus** view with real-time countdown (`formatEtaCountdown`).
- Contextual passenger status notifications:
  - *"Your bus is approaching your stop now!"*
  - *"Your bus is 2 stops away."*
  - *"Your bus has arrived at your boarding stop."*
  - *"Bus has passed your boarding stop. Destination is X stops away."*
- **Upcoming Stops Timeline:** Highlights passed stops, active bus position, and upcoming stops.
- Simulation speed controls (`1x`, `2x`, `5x`) and pause/resume capability.

### 🚌 Bus Routes Directory
- Search routes by route number (e.g. `119`, `201`, `303`, `10A`), landmark, or destination.
- View full intermediate stop sequences and schedules.
- Direct preview on map with 1-click tracking.

---

## 4. Future Real-Time GPS Hardware Pipeline

Mysuru Marga is architected with a strict service abstraction layer (`IBusLocationService`, `IRouteService`, `IJourneyPlannerService`). The UI components never touch raw mock datasets directly.

```
Future Physical Data Pipeline:
┌─────────────────┐       ┌────────────────┐       ┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
│ In-Bus AIS-140  │ ───►  │ 4G GSM Cellular│ ───►  │ Cloud Ingestion │ ───►  │ WebSocket Server │ ───►  │ Passenger PWA   │
│ GPS Tracker     │       │ Network        │       │ Backend API     │       │ & Redis Store    │       │ (Mysuru Marga)  │
└─────────────────┘       └────────────────┘       └─────────────────┘       └──────────────────┘       └─────────────────┘
```

When physical GPS trackers are mounted on Mysuru city buses, the frontend transitions to live feeds simply by swapping `MockBusLocationService` with `WebSocketBusLocationService`.

---

## 5. Technology Stack

- **Framework:** Next.js 16 with App Router
- **Runtime & Language:** React 19, TypeScript 5
- **Styling:** Tailwind CSS v4 with custom theme tokens
- **Maps:** Leaflet 1.9.4 & OpenStreetMap
- **Icons:** Lucide React
- **Geospatial Math:** Haversine formula, spherical bearing calculations, polyline interpolation

---

## 6. Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Riddhisingh10/MYSURU-MARGA.git
cd MYSURU-MARGA

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## 7. Demonstration Notice

> **DEMO MODE:** All bus coordinates, routes, and timetables currently shown on this platform are demonstration models for architectural evaluation. Do not rely on this data for actual city travel until verified official feeds are connected.

---

## 8. License

Distributed under the MIT License. Built with ❤️ for the citizens and visitors of Mysuru, Karnataka.


<!-- Verified for production release on GitHub -->
