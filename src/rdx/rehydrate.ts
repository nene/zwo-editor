import { Distance, Duration } from '../types/Length';

export function convertLengths(obj: {[k: string]: any}) {
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
