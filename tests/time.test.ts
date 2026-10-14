/**
 * Unit Tests for Time Formatting in Mysuru Marga
 */
import { formatTime12h, formatEtaCountdown, parseTimeToMinutes, formatDuration } from '../lib/time';

describe('Time Utilities', () => {
  test('formats 12-hour clock correctly', () => {
    expect(formatTime12h(9 * 60 + 15)).toBe('9:15 AM');
    expect(formatTime12h(14 * 60 + 30)).toBe('2:30 PM');
  });

  test('formats ETA countdown string', () => {
    expect(formatEtaCountdown(0)).toBe('Arriving now');
    expect(formatEtaCountdown(1)).toBe('In 1 min');
    expect(formatEtaCountdown(6)).toBe('In 6 min');
  });

  test('parses time strings to minutes from midnight', () => {
    expect(parseTimeToMinutes('10:45 AM')).toBe(645);
    expect(parseTimeToMinutes('02:30 PM')).toBe(870);
  });

  test('formats duration into readable text', () => {
    expect(formatDuration(24)).toBe('24 min');
    expect(formatDuration(75)).toBe('1 hr 15 min');
  });
});

// Test: 12-hour AM/PM boundaries at midnight and noon
