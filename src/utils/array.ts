import { propEq, update } from "ramda";

// Replaces element in array with item having the same id
export function replaceById<T extends { id: string }>(
  item: T,
  array: T[]
): T[] {
  const index = array.findIndex(propEq("id", item.id));
  return index === -1 ? array : update(index, item, array);
}
