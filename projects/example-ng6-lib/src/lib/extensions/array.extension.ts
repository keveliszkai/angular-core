Array.prototype.first = first;
Array.prototype.last = last;
Array.prototype.exists = exists;
Array.prototype.intersect = intersect;

interface Array<T> {
  first: typeof first;
  last: typeof last;
  exists: typeof exists;
  intersect: typeof intersect;
}

/**
 * This function returns the first element of the array, if it exists. Otherwise it returns null.
 * @param this The array itself
 * @returns T | null
 */
function first<T>(this: T[]): T | null {
  return this.length ? this[0] : null;
}

/**
 * This function returns the last element of the array, if it exists. Otherwise it returns null.
 * @param this The array itself
 * @returns T | null
 */
function last<T>(this: T[]): T | null {
  return this.length ? this[this.length - 1] : null;
}

/**
 * This function returns true, if the array exists (has more than one element).
 * @param this The array itself
 * @returns boolean
 */
function exists<T>(this: T[]): boolean {
  return !!this.length;
}

/**
 * This function gets the intersects of two arrays.
 * @param this The array itself
 * @param array The relative array. The other one, that needs to check.
 * @example array.intersect(array2);
 * @returns Array<T>
 */
function intersect<T>(this: T[], array: T[]) {
  return this.filter(function(n) {
    return array.indexOf(n) !== -1;
  });
}
