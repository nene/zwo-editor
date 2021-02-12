import { SportType } from "./SportType";
import { Interval } from "./Interval";
import { LengthType } from "./LengthType";

export interface Workout {
  author: string;
  name: string;
  description: string;
  sportType: SportType;
  lengthType: LengthType;
  tags: string[];
  intervals: Array<Interval>;
}

export function createEmptyWorkout(
  sportType: SportType,
  lengthType: LengthType
): Workout {
  return {
    author: "",
    name: "",
    description: "",
    sportType: sportType,
    lengthType: lengthType,
    tags: [],
    intervals: [],
  };
}
