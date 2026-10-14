# System Architecture & Hardware Integration Specification
### Mysuru Marga Transit Platform

## 1. Architectural Philosophy
Mysuru Marga is built with a decoupled, service-oriented architecture designed to transition smoothly from client-side simulation to live GPS-equipped municipal bus fleets.

```
+-----------------------------------------------------------------------------------+
|                               PASSENGER WEB APP                                   |
|   +-------------------+  +--------------------+  +----------------------------+   |
|   |  Journey Planner  |  | Bus Routes & Stops |  | Live Bus Tracker & Map     |   |
|   +-------------------+  +--------------------+  +----------------------------+   |
+-----------------------------------------+-----------------------------------------+
                                          |
                              (TypeScript Interfaces)
       +----------------------------------+----------------------------------+
       |                                  |                                  |
+------v-----------------+      +---------v--------------+     +-------------v-------------+
|  IBusLocationService   |      | IJourneyPlannerService |     |     IRouteService         |
+------------------------+      +------------------------+     +---------------------------+
       |                                  |                                  |
(Active Implementation)            (Multi-Criteria Routing)       (Network Graph)
       |                                  |                                  |
+------v-----------------+      +---------v--------------+     +-------------v-------------+
| MockBusLocationService |      | JourneyPlannerService  |     |      RouteService         |
+------------------------+      +------------------------+     +---------------------------+
       |
(Future Seamless Swap)
       |
+------v-----------------------+
| WebSocketBusLocationService  |
+------------------------------+
```

## 2. Ingestion Pipeline (Future Hardware Phase)
- **Tracker Hardware:** AIS-140 Compliant Dual-band GNSS / 4G LTE tracker installed on bus electrical system.
- **Protocol:** MQTT over TLS / HTTPS REST POST telemetry every 3 seconds.
- **Payload Schema:**
```json
{
  "device_id": "AIS140-KA09-1191",
  "bus_id": "KA-09-F-1191",
  "route_id": "route-119-up",
  "latitude": 12.30861,
  "longitude": 76.65422,
  "altitude_m": 770.2,
  "speed_kmh": 24.5,
  "heading_deg": 142.0,
  "satellites": 12,
  "ignition": true,
  "emergency_status": "NORMAL",
  "timestamp_utc": 1776214800000
}
```
