import { Distance, Duration } from '../types/Length';

function convertLengths(obj: {[k: string]: any}) {
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "object" && typeof v.seconds === "number") {
      obj[k] = new Duration(v.seconds);
    }
    else if (typeof v === "object" && typeof v.meters === "number") {
      obj[k] = new Distance(v.meters);
    }
  }
  return obj;
}

export function rehydrateLengths<T extends object>(arr?: T[]): T[] {
  if (!(arr instanceof Array)) {
    return [];
  }
  return arr.map(convertLengths) as T[];
}