import { Zones } from "./Constants";
import { Interval } from "./Interval";

// Helpers for transforming intervals array

function updateById(id: string, transform: (interval: Interval) => Interval, intervals: Interval[]): Interval[] {
  const index = intervals.findIndex(interval => interval.id === id);
  if (index === -1) {
    return intervals;
  }

  return [
    ...intervals.slice(0, index),
    ...[transform(intervals[index])],
    ...intervals.slice(index + 1),
  ];
}

export function updateIntervalDuration(id: string, dDuration: number, intervals: Interval[]): Interval[] {
  return updateById(id, (interval) => {
    if (interval.type === 'steady') {
      const duration = interval.duration + dDuration;
      if (duration > 0) {
        return { ...interval, duration };
      }
    }
    return interval;
  }, intervals);
}

export function updateIntervalPower(id: string, dPower: number, intervals: Interval[]): Interval[] {
  return updateById(id, (interval) => {
    if (interval.type === 'steady') {
      const power = interval.power + dPower;
      if (power > Zones.Z1.min) {
        return { ...interval, power };
      }
    }
    return interval;
  }, intervals);
}

export function moveInterval(id: string, direction: -1 | 1, intervals: Interval[]): Interval[] {
  const oldIndex = intervals.findIndex(interval => interval.id === id);
  const newIndex = oldIndex + direction;

  if (newIndex < 0 || newIndex >= intervals.length) {
    return intervals;
  }

  const newArray = [...intervals];
  newArray[newIndex] = intervals[oldIndex];
  newArray[oldIndex] = intervals[newIndex];
  return newArray;
}