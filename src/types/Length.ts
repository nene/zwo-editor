export class Duration {
  constructor(public readonly seconds: number) {}
}

export class Distance {
  constructor(public readonly meters: number) {}
}

export type Length = Distance | Duration;

// Alternative approach
//
// This way we could avoid storing class instances to Redux,
// which eliminates problems with serialization & deserialization.
/*
export type Distance = { meters: number };
export type Duration = { seconds: number };
export type Length = Distance | Duration;

export const Distance = (meters: number) => ({ meters });
export const Duration = (seconds: number) => ({ seconds });

export const isDistance = (obj: Length): obj is Distance => 'meters' in obj;
export const isDuration = (obj: Length): obj is Duration => 'seconds' in obj;
*/
