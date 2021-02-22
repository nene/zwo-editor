import { range } from "ramda";
import { WorkoutMode } from "../modes/WorkoutMode";
import { Instruction } from "../types/Instruction";
import { RepetitionInterval, SteadyInterval } from "../types/Interval";
import intervalFactory from "./intervalFactory";

export function repetitionToSteadyIntervals(
  interval: RepetitionInterval,
  mode: WorkoutMode
): SteadyInterval[] {
  return range(0, interval.repeat).flatMap((n) => {
    const onSize: number = mode.fromLength(interval.onLength);
    const offSize: number = mode.fromLength(interval.offLength);
    const precedingSize: number = (onSize + offSize) * n;

    return [
      intervalFactory.steady(
        {
          length: interval.onLength,
          intensity: interval.onIntensity,
          cadence: interval.onCadence,
          pace: interval.pace,
          instructions: interval.instructions.filter(
            withinRange(precedingSize, precedingSize + onSize, mode)
          ),
        },
        mode
      ),
      intervalFactory.steady(
        {
          length: interval.offLength,
          intensity: interval.offIntensity,
          cadence: interval.offCadence,
          pace: interval.pace,
          instructions: interval.instructions.filter(
            withinRange(
              precedingSize + onSize,
              precedingSize + onSize + offSize,
              mode
            )
          ),
        },
        mode
      ),
    ];
  });
}

function withinRange(
  from: number,
  to: number,
  mode: WorkoutMode
): (ins: Instruction) => boolean {
  return (ins: Instruction) =>
    mode.fromLength(ins.offset) >= from && mode.fromLength(ins.offset) < to;
}
