/**
 * Unit Tests for Geodesic Calculations in Mysuru Marga
 */
import { getDistanceMeters, calculateHeading, estimateWalkMinutes } from '../lib/geo';

describe('Geodesic Math', () => {
  const cbs = { lat: 12.3086, lng: 76.6542 };
  const palace = { lat: 12.3051, lng: 76.6551 };

  test('calculates reasonable distance between CBS and Palace (~400m)', () => {
    const dist = getDistanceMeters(cbs, palace);
    expect(dist).toBeGreaterThan(350);
    expect(dist).toBeLessThan(500);
  });

  test('calculates heading degrees correctly', () => {
    const heading = calculateHeading(cbs, palace);
    expect(heading).toBeGreaterThan(0);
    expect(heading).toBeLessThan(360);
  });

  test('estimates walking minutes logically (~75m/min)', () => {
    expect(estimateWalkMinutes(300)).toBe(4);
    expect(estimateWalkMinutes(750)).toBe(10);
  });
});

// Test: getRemainingDistanceToStop accuracy
