/**
 * Tank calculation utilities
 */

/**
 * Calculate tank volume in gallons from stored cm dimensions
 * @param lengthCm - Tank length in centimeters (as stored in database)
 * @param widthCm - Tank width in centimeters (as stored in database)
 * @param heightCm - Tank height in centimeters (as stored in database)
 * @returns Volume in gallons rounded to 1 decimal place
 */
export function calculateTankVolumeGallons(lengthCm: number, widthCm: number, heightCm: number): string {
  // Convert cm back to inches
  const lengthInches = lengthCm / 2.54;
  const widthInches = widthCm / 2.54;
  const heightInches = heightCm / 2.54;
  
  // Calculate volume in cubic inches, then convert to gallons
  const volumeCubicInches = lengthInches * widthInches * heightInches;
  const volumeGallons = volumeCubicInches / 231;
  
  return volumeGallons.toFixed(1);
}

/**
 * Convert cm dimensions back to inches for display
 * @param lengthCm - Length in centimeters
 * @param widthCm - Width in centimeters  
 * @param heightCm - Height in centimeters
 * @returns Object with rounded inch dimensions
 */
export function convertCmToInchesForDisplay(lengthCm: number, widthCm: number, heightCm: number) {
  return {
    length: Math.round(lengthCm / 2.54),
    width: Math.round(widthCm / 2.54),
    height: Math.round(heightCm / 2.54)
  };
} 