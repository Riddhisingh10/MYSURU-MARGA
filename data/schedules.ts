import { ScheduleItem } from '@/types/bus';

// Generate consistent daily departure schedules from 06:00 to 22:30
function generateSchedules(routeId: string, frequencyMin: number, startStopId: string): ScheduleItem[] {
  const items: ScheduleItem[] = [];
  const startHour = 6;
  const endHour = 22;

  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += frequencyMin) {
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h % 12 === 0 ? 12 : h % 12;
      const displayMinute = m < 10 ? `0${m}` : `${m}`;
      items.push({
        routeId,
        stopId: startStopId,
        departureTime: `${displayHour}:${displayMinute} ${period}`,
        direction: 'UP',
        serviceDays: 'DAILY',
      });
    }
  }

  return items;
}

export const MYSURU_SCHEDULES: ScheduleItem[] = [
  ...generateSchedules('route-119-up', 15, 'stop-cbs'),
  ...generateSchedules('route-201-up', 12, 'stop-cbs'),
  ...generateSchedules('route-303-up', 10, 'stop-cbs'),
  ...generateSchedules('route-10A-up', 15, 'stop-railway-station'),
  ...generateSchedules('route-135-up', 20, 'stop-bannimantap'),
  ...generateSchedules('route-62-up', 10, 'stop-cbs'),
];
