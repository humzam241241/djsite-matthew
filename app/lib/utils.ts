/**
 * Safely get gallery items from the gallery data
 * Handles both the new format (array of items) and old format (object with items property)
 * 
 * @param galleryData The gallery data from content/gallery.json
 * @returns An array of gallery items
 */
export function getGalleryItems(galleryData: any): any[] {
  // If it's already an array, return it
  if (Array.isArray(galleryData)) {
    return galleryData;
  }
  
  // If it's an object with an items property that is an array, return that
  if (galleryData && Array.isArray(galleryData.items)) {
    return galleryData.items;
  }
  
  // Otherwise, return an empty array
  return [];
}

/**
 * Safely get a value from an object with a fallback
 * 
 * @param obj The object to get the value from
 * @param path The path to the value, e.g. "user.profile.name"
 * @param fallback The fallback value if the path doesn't exist
 * @returns The value at the path or the fallback
 */
export function get(obj: any, path: string, fallback: any = undefined): any {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return fallback;
    }
    result = result[key];
  }
  
  return result === undefined ? fallback : result;
}

/**
 * Check if a value is defined (not undefined or null)
 * 
 * @param value The value to check
 * @returns True if the value is defined, false otherwise
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}
