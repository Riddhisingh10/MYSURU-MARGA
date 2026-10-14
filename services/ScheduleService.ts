import { ScheduleItem } from '@/types/bus';
import { IScheduleService } from './types';
import { MYSURU_SCHEDULES } from '@/data/schedules';
import { parseTimeToMinutes, formatTime12h } from '@/lib/time';

export class ScheduleService implements IScheduleService {
  async getSchedulesForRoute(routeId: string): Promise<ScheduleItem[]> {
    return MYSURU_SCHEDULES.filter((s) => s.routeId === routeId);
  }

  async getNextScheduledDeparture(
    routeId: string,
    stopId: string,
    afterTime: Date = new Date()
  ): Promise<string | null> {
    const currentMins = afterTime.getHours() * 60 + afterTime.getMinutes();
    const routeSchedules = MYSURU_SCHEDULES.filter(
      (s) => s.routeId === routeId && s.stopId === stopId
    );

    if (routeSchedules.length === 0) {
      // If no exact match for stop, generate dynamic schedule based on current time + 8 mins
      return formatTime12h(currentMins + 8);
    }

    // Find the earliest scheduled time after current time
    for (const item of routeSchedules) {
      const itemMins = parseTimeToMinutes(item.departureTime);
      if (itemMins >= currentMins) {
        return item.departureTime;
      }
    }

    // Wrap around to first departure tomorrow morning
    return routeSchedules[0]?.departureTime || null;
  }
}

export const scheduleService = new ScheduleService();
