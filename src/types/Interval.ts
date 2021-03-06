import { Instruction } from "./Instruction";
import { Length } from "./Length";
import { PaceType } from "./PaceType";

export interface SteadyInterval {
  id: string;
  length: Length;
  type: "steady";
  intensity: number;
  cadence?: number;
  pace: PaceType;
  instructions: Instruction[];
}

export interface RampInterval {
  id: string;
  length: Length;
  type: "ramp";
  startIntensity: number;
  endIntensity: number;
  cadence?: number;
  pace: PaceType;
  instructions: Instruction[];
}

export interface FreeInterval {
  id: string;
  length: Length;
  type: "free";
  cadence?: number;
  instructions: Instruction[];
}

export interface RepetitionInterval {
  id: string;
  type: "repetition";
  onCadence?: number;
  offCadence?: number;
  onIntensity: number;
  offIntensity: number;
  onLength: Length;
  offLength: Length;
  repeat: number;
  pace: PaceType;
  instructions: Instruction[];
}

export type Interval =
  | SteadyInterval
  | RampInterval
  | FreeInterval
  | RepetitionInterval;
