/**
 * Firestore Payload Sanitizer
 * Guarantees zero `undefined` values reach Firestore setDoc/updateDoc/addDoc.
 * 
 * Rules:
 * - Recursively removes keys where value === undefined
 * - Preserves null, false, 0, and empty strings ("")
 * - Cleans arrays by filtering out undefined values and recursing into objects
 */

export function sanitizeFirestorePayload<T>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestorePayload(item)) as unknown as T;
  }

  // Handle Date objects or other native instances
  if (obj instanceof Date) {
    return obj;
  }

  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj as Record<string, any>)) {
    if (value !== undefined) {
      cleanObj[key] = sanitizeFirestorePayload(value);
    }
  }

  return cleanObj as T;
}
