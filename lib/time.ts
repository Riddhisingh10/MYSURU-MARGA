/**
 * Time and formatting utilities for Mysuru Marga
 */

/**
 * Formats a Date object or simulated minutes from midnight into 12-hour clock (e.g. "10:45 AM")
 */
export function formatTime12h(dateOrMinutes: Date | number): string {
  let hours = 0;
  let minutes = 0;

  if (typeof dateOrMinutes === 'number') {
    hours = Math.floor(dateOrMinutes / 60) % 24;
    minutes = Math.floor(dateOrMinutes % 60);
  } else {
    hours = dateOrMinutes.getHours();
    minutes = dateOrMinutes.getMinutes();
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${displayHours}:${displayMinutes} ${period}`;
}

/**
 * Formats countdown minutes into readable passenger text:
 * e.g. "Arriving now", "In 1 min", "In 6 min", "In 25 min"
 */
export function formatEtaCountdown(minutesRemaining: number): string {
  if (minutesRemaining <= 0) {
    return 'Arriving now';
  }
  if (minutesRemaining === 1) {
    return 'In 1 min';
  }
  return `In ${Math.round(minutesRemaining)} min`;
}

/**
 * Calculates arrival clock time given current time + minutes
 */
export function calculateFutureClockTime(minutesAhead: number, baseDate: Date = new Date()): string {
  const future = new Date(baseDate.getTime() + minutesAhead * 60 * 1000);
  return formatTime12h(future);
}

/**
 * Formats duration in minutes to passenger readable string:
 * e.g. "24 min", "1 hr 15 min"
 */
export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${Math.round(totalMinutes)} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}

/**
 * Formats distance in meters to readable format (e.g., "150 m", "1.2 km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Parses time string like "08:15 AM" or "14:30" to minutes from midnight
 */
export function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}
