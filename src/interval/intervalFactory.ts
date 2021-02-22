import { v4 as uuidv4 } from "uuid";
import { PaceType } from "../types/PaceType";
import {
  FreeInterval,
  Interval,
  RampInterval,
  RepetitionInterval,
  SteadyInterval,
} from "../types/Interval";
import { Distance, Duration, Length } from "../types/Length";
import { WorkoutMode } from "../modes/WorkoutMode";

const defaultDuration = Duration(300);
const defaultDistance = Distance(1000);
const defaultIntensity = 1.0;
const defaultPace = PaceType.oneMile;

const defaultLength = (mode: WorkoutMode): Length =>
  mode.lengthType === "time" ? defaultDuration : defaultDistance;

export default {
  steady(interval: Partial<SteadyInterval>, mode: WorkoutMode): SteadyInterval {
    return {
      type: "steady",
      id: uuidv4(),
      length: defaultLength(mode),
      intensity: defaultIntensity,
      cadence: undefined,
      pace: defaultPace,
      instructions: [],
      ...interval,
    };
  },

  ramp(interval: Partial<RampInterval>, mode: WorkoutMode): RampInterval {
    return {
      type: "ramp",
      id: uuidv4(),
      length: defaultLength(mode),
      startIntensity: defaultIntensity / 2,
      endIntensity: defaultIntensity,
      cadence: undefined,
      pace: defaultPace,
      instructions: [],
      ...interval,
    };
  },

  free(interval: Partial<FreeInterval>, mode: WorkoutMode): FreeInterval {
    return {
      type: "free",
      id: uuidv4(),
      length: defaultLength(mode),
      cadence: undefined,
      instructions: [],
      ...interval,
    };
  },

  repetition(
    interval: Partial<RepetitionInterval>,
    mode: WorkoutMode
  ): RepetitionInterval {
    return {
      type: "repetition",
      id: uuidv4(),
      repeat: 3,
      onLength: mode.lengthType === "time" ? Duration(30) : Distance(200),
      offLength: mode.lengthType === "time" ? Duration(120) : Distance(200),
      onIntensity: defaultIntensity,
      offIntensity: defaultIntensity / 2,
      onCadence: undefined,
      offCadence: undefined,
      pace: defaultPace,
      instructions: [],
      ...interval,
    };
  },

  // Creates a copy of the interval, with a new ID
  clone(interval: Interval): Interval {
    return { ...interval, id: uuidv4() };
  },
};
