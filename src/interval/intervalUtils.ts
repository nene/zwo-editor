import { Zones } from "../types/Zones";
import { Interval } from "../types/Interval";
import {
  Distance,
  Duration,
  isDistance,
  isDuration,
  Length,
} from "../types/Length";
import { WorkoutMode } from "../modes/WorkoutMode";
import { move, propEq, update } from "ramda";

// Helpers for transforming intervals array

function updateById(
  id: string,
  transform: (interval: Interval) => Interval,
  intervals: Interval[]
): Interval[] {
  const index = intervals.findIndex(propEq("id", id));
  if (index === -1) {
    return intervals;
  }

  return update(index, transform(intervals[index]), intervals);
}

export function updateIntervalLength(
  id: string,
  dLength: Length,
  intervals: Interval[],
  mode: WorkoutMode
): Interval[] {
  return updateById(
    id,
    (interval) => {
      if (
        interval.type === "steady" ||
        interval.type === "free" ||
        interval.type === "ramp"
      ) {
        const length = addLengths(mode.intervalLength(interval), dLength);
        if (mode.fromLength(length) > 0) {
          return { ...interval, length };
        }
      }
      return interval;
    },
    intervals
  );
}

function addLengths(a: Length, b: Length): Length {
  if (isDuration(a) && isDuration(b)) {
    return Duration(a.seconds + b.seconds);
  } else if (isDistance(a) && isDistance(b)) {
    return Distance(a.meters + b.meters);
  } else {
    throw new Error(`Unable to sum Distance with Duration`);
  }
}

export function updateIntervalIntensity(
  id: string,
  dIntensity: number,
  intervals: Interval[]
): Interval[] {
  return updateById(
    id,
    (interval) => {
      if (interval.type === "steady") {
        const intensity = interval.intensity + dIntensity;
        if (intensity > Zones.Z1.min) {
          return { ...interval, intensity };
        }
      }
      return interval;
    },
    intervals
  );
}

export function moveInterval(
  id: string,
  direction: -1 | 1,
  intervals: Interval[]
): Interval[] {
  const oldIndex = intervals.findIndex(propEq("id", id));
  const newIndex = oldIndex + direction;

  if (oldIndex < 0 || newIndex < 0 || newIndex >= intervals.length) {
    return intervals;
  }

  return move(oldIndex, newIndex, intervals);
}
