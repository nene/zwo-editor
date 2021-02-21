import { range } from "ramda";
import { WorkoutMode } from "../modes/WorkoutMode";
import { RepetitionInterval, SteadyInterval } from "../types/Interval";
import { Length } from "../types/Length";
import intervalFactory from "./intervalFactory";

export function repetitions(
  repeat: number,
  onLength: Length,
  offLength: Length,
  interval: RepetitionInterval,
  mode: WorkoutMode
): SteadyInterval[] {
  return range(0, repeat).flatMap(() => [
    intervalFactory.steady(
      {
        length: onLength,
        intensity: interval.onIntensity,
        cadence: interval.onCadence,
        pace: interval.pace,
      },
      mode
    ),
    intervalFactory.steady(
      {
        length: offLength,
        intensity: interval.offIntensity,
        cadence: interval.offCadence,
        pace: interval.pace,
      },
      mode
    ),
  ]);
}
