import { range } from "ramda";
import { WorkoutMode } from "../modes/WorkoutMode";
import { Instruction } from "../types/Instruction";
import { RepetitionInterval, SteadyInterval } from "../types/Interval";
import { isDuration, Length } from "../types/Length";
import intervalFactory from "./intervalFactory";

export function repetitionToSteadyIntervals(
  interval: RepetitionInterval,
  mode: WorkoutMode
): SteadyInterval[] {
  return range(0, interval.repeat).flatMap((n) => {
    const onSize: number = writeLength(interval.onLength);
    const offSize: number = writeLength(interval.offLength);
    const precedingSize: number = (onSize + offSize) * n;

    return [
      intervalFactory.steady(
        {
          length: interval.onLength,
          intensity: interval.onIntensity,
          cadence: interval.onCadence,
          pace: interval.pace,
          instructions: interval.instructions.filter(
            withinRange(precedingSize, precedingSize + onSize)
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
              precedingSize + onSize + offSize
            )
          ),
        },
        mode
      ),
    ];
  });
}

const writeLength = (len: Length): number =>
  isDuration(len) ? len.seconds : len.meters;

function withinRange(from: number, to: number): (ins: Instruction) => boolean {
  return (ins: Instruction) =>
    writeLength(ins.offset) >= from && writeLength(ins.offset) < to;
}
