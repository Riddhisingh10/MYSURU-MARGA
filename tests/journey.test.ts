/**
 * Unit Tests for Journey Planning Logic
 */
import { JourneyPlannerService } from '../services/JourneyPlannerService';

describe('Journey Planner', () => {
  const planner = new JourneyPlannerService();

  test('successfully initialises planner instance', () => {
    expect(planner).toBeDefined();
    expect(typeof planner.findJourneys).toBe('function');
  });
});
