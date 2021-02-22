import { SportType } from "../types/SportType";
import { PaceType } from "../types/PaceType";
import { RunningTimes } from "../types/RunningTimes";
import { runningDistances } from "../types/runningDistances";
import { LengthType } from "../types/LengthType";
import Mode from "./Mode";
import {
  Distance,
  Duration,
  isDistance,
  isDuration,
  Length,
} from "../types/Length";
import { Interval } from "../types/Interval";

export default class RunMode extends Mode {
  private runningTimes: RunningTimes;
  public readonly sportType: SportType = "run";
  public readonly lengthType: LengthType;

  constructor(runningTimes: RunningTimes, lengthType: LengthType) {
    super();
    this.runningTimes = runningTimes;
    this.lengthType = lengthType;
  }

  speed(intensity: number, pace: PaceType): number {
    return (runningDistances[pace] / this.runningTimes[pace]) * intensity; // in m/s
  }

  distance(length: Length, intensity: number, pace: PaceType): Distance {
    if (isDuration(length)) {
      return Distance(this.speed(intensity, pace) * length.seconds);
    } else {
      return length;
    }
  }

  duration(length: Length, intensity: number, pace: PaceType): Duration {
    if (isDuration(length)) {
      return length;
    } else {
      return Duration(length.meters / this.speed(intensity, pace));
    }
  }

  intervalDistance(interval: Interval): Distance {
    switch (interval.type) {
      case "free": {
        return isDistance(interval.length) ? interval.length : Distance(0);
      }
      case "steady": {
        return this.distance(
          interval.length,
          interval.intensity,
          interval.pace
        );
      }
      case "ramp": {
        return this.distance(
          interval.length,
          (interval.startIntensity + interval.endIntensity) / 2,
          interval.pace
        );
      }
      case "repetition": {
        const onDistance = this.distance(
          interval.onLength,
          interval.onIntensity,
          interval.pace
        );
        const offDistance = this.distance(
          interval.offLength,
          interval.offIntensity,
          interval.pace
        );
        return Distance(
          interval.repeat * (onDistance.meters + offDistance.meters)
        );
      }
    }
  }

  intervalDuration(interval: Interval): Duration {
    switch (interval.type) {
      case "free":
        return isDuration(interval.length) ? interval.length : Duration(0);
      case "steady":
        return this.duration(
          interval.length,
          interval.intensity,
          interval.pace
        );
      case "ramp":
        return this.duration(
          interval.length,
          (interval.startIntensity + interval.endIntensity) / 2,
          interval.pace
        );
      case "repetition": {
        const onDuration = this.duration(
          interval.onLength,
          interval.onIntensity,
          interval.pace
        );
        const offDuration = this.duration(
          interval.offLength,
          interval.offIntensity,
          interval.pace
        );
        return Duration(
          interval.repeat * (onDuration.seconds + offDuration.seconds)
        );
      }
    }
  }

  intervalLength(interval: Interval): Length {
    if (this.lengthType === "time") {
      return this.intervalDuration(interval);
    } else {
      return this.intervalDistance(interval);
    }
  }
}
