import { range } from "ramda";
import { WorkoutMode } from "../modes/WorkoutMode";
import { RepetitionInterval, SteadyInterval } from "../types/Interval";
import intervalFactory from "./intervalFactory";

export function repetitionToSteadyIntervals(
  interval: RepetitionInterval,
  mode: WorkoutMode
): SteadyInterval[] {
  return range(0, interval.repeat).flatMap(() => [
    intervalFactory.steady(
      {
        length: interval.onLength,
        intensity: interval.onIntensity,
        cadence: interval.onCadence,
        pace: interval.pace,
      },
      mode
    ),
    intervalFactory.steady(
      {
        length: interval.offLength,
        intensity: interval.offIntensity,
        cadence: interval.offCadence,
        pace: interval.pace,
      },
      mode
    ),
  ]);
}
