/**
 * Distance & Duration
 *
 * These types are just wrappers around Number,
 * to discriminate between two kinds of lengths.
 *
 * Previously these were implemented as classes,
 * which made interop with Redux problematic,
 * especially because it complicated the serialization & deserialization
 * when saving Redux state to localStorage.
 */
export type Distance = { meters: number };
export type Duration = { seconds: number };
export type Length = Distance | Duration;

export const Distance = (meters: number): Distance => ({ meters });
export const Duration = (seconds: number): Duration => ({ seconds });

export const isDistance = (obj: Length): obj is Distance => "meters" in obj;
export const isDuration = (obj: Length): obj is Duration => "seconds" in obj;
