import { SportType } from "../types/SportType";
import { PaceType } from "../types/PaceType";
import { RunningTimes } from "../types/RunningTimes";
import { runningDistances } from "../types/runningDistances";
import { DurationType } from "../types/DurationType";
import DurationMode from "./DurationMode";
import { Distance, Duration, Length } from "../types/Length";

export default class RunMode extends DurationMode {
  private runningTimes: RunningTimes;
  public readonly sportType: SportType = "run";
  public readonly durationType: DurationType;

  constructor(runningTimes: RunningTimes, durationType: DurationType) {
    super();
    this.runningTimes = runningTimes;
    this.durationType = durationType;
  }

  shortPaceName(pace: PaceType): string {
    const paces = ["1M", "5K", "10K", "HM", "M"];
    return paces[pace];
  }

  speed(intensity: number, pace: PaceType): number {
    return runningDistances[pace] / this.runningTimes[pace] * intensity; // in m/s
  }

  distance(length: Length, intensity: number, pace: PaceType): Distance {
    if (length instanceof Duration) {
      return new Distance(Math.round(this.speed(intensity, pace) * length.seconds));
    } else {
      return length;
    }
  }

  duration(length: Length, intensity: number, pace: PaceType): Duration {
    if (length instanceof Duration) {
      return length;
    } else {
      return new Duration(length.meters / this.speed(intensity, pace));
    }
  }
}
