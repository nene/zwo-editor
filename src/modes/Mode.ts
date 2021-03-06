import {
  distanceMultiplier,
  durationMultiplier,
  intensityMultiplier,
} from "../components/Bar/multipliers";
import { Distance, Duration, isDuration, Length } from "../types/Length";
import { LengthType } from "../types/LengthType";
import { SportType } from "../types/SportType";
import { floor } from "../utils/math";

interface Precision {
  meters: number;
  seconds: number;
}

// Base class for duration-based Mode classes
export default abstract class Mode {
  public abstract readonly sportType: SportType;
  public abstract readonly lengthType: LengthType;

  lengthToWidth(length: Length): number {
    if (isDuration(length)) {
      return length.seconds / durationMultiplier;
    } else {
      return length.meters / distanceMultiplier;
    }
  }

  widthToLength(
    width: number,
    precision: Precision = { meters: 200, seconds: 5 }
  ): Length {
    if (this.lengthType === "time") {
      return Duration(floor(width * durationMultiplier, precision.seconds));
    } else {
      return Distance(floor(width * distanceMultiplier, precision.meters));
    }
  }

  // Returns the underlyng number within Length type
  fromLength(length: Length): number {
    return isDuration(length) ? length.seconds : length.meters;
  }

  intensityToHeight(intensity: number): number {
    return intensity * intensityMultiplier;
  }

  heightToIntensity(height: number): number {
    return height / intensityMultiplier;
  }
}
