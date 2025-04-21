
/**
 * Utility functions for safely handling data that might be undefined or null
 */

/**
 * Safely get a property from an object that might be undefined or null
 * @param obj The object to get the property from
 * @param path The path to the property, e.g. 'user.name'
 * @param defaultValue The default value to return if the property is undefined
 */
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj) return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) return defaultValue;
    result = result[key];
  }
  
  return (result === undefined || result === null) ? defaultValue : result as T;
}

/**
 * Check if an object is a valid, non-empty object
 */
export function isValidObject(obj: any): boolean {
  return obj !== null && 
         obj !== undefined && 
         typeof obj === 'object' &&
         !Array.isArray(obj) && 
         Object.keys(obj).length > 0;
}

/**
 * Safely convert a value to a number with a default
 */
export function safeNumber(value: any, defaultValue: number = 0): number {
  if (value === undefined || value === null) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Safely format a number with toFixed, handling undefined values
 */
export function safeToFixed(value: any, digits: number = 2, defaultValue: string = '0'): string {
  if (value === undefined || value === null) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num.toFixed(digits);
}

/**
 * Safely access an array that might be undefined or null
 */
export function safeArray<T>(arr: T[] | undefined | null, defaultValue: T[] = []): T[] {
  return Array.isArray(arr) ? arr : defaultValue;
}
