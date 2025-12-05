// Image quality scoring helpers

/**
 * Compute lighting score based on average brightness
 * Returns a score from 0-100
 */
export function computeLightingScore(imageData: ImageData): number {
  const data = imageData.data;
  let sum = 0;
  const pixelCount = data.length / 4;

  // Sample every 10th pixel for performance
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Calculate perceived brightness
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    sum += brightness;
  }

  const avgBrightness = sum / (pixelCount / 10);
  
  // Optimal range is 80-180
  if (avgBrightness >= 80 && avgBrightness <= 180) {
    return 100;
  } else if (avgBrightness < 80) {
    // Too dark
    return Math.max(0, (avgBrightness / 80) * 100);
  } else {
    // Too bright
    return Math.max(0, 100 - ((avgBrightness - 180) / 75) * 100);
  }
}

/**
 * Compute sharpness score using Laplacian variance
 * Higher variance indicates sharper image
 */
export function computeSharpnessScore(imageData: ImageData): number {
  const { width, height, data } = imageData;
  
  // Downsample for performance - use every 4th pixel
  const step = 4;
  let variance = 0;
  let count = 0;

  // Laplacian kernel for edge detection
  for (let y = step; y < height - step; y += step) {
    for (let x = step; x < width - step; x += step) {
      const idx = (y * width + x) * 4;
      
      // Get grayscale value
      const center = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      
      // Get neighboring pixels
      const top = 0.299 * data[((y - step) * width + x) * 4] + 
                  0.587 * data[((y - step) * width + x) * 4 + 1] + 
                  0.114 * data[((y - step) * width + x) * 4 + 2];
      const bottom = 0.299 * data[((y + step) * width + x) * 4] + 
                     0.587 * data[((y + step) * width + x) * 4 + 1] + 
                     0.114 * data[((y + step) * width + x) * 4 + 2];
      const left = 0.299 * data[(y * width + (x - step)) * 4] + 
                   0.587 * data[(y * width + (x - step)) * 4 + 1] + 
                   0.114 * data[(y * width + (x - step)) * 4 + 2];
      const right = 0.299 * data[(y * width + (x + step)) * 4] + 
                    0.587 * data[(y * width + (x + step)) * 4 + 1] + 
                    0.114 * data[(y * width + (x + step)) * 4 + 2];
      
      // Laplacian: center * 4 - (top + bottom + left + right)
      const laplacian = Math.abs(center * 4 - (top + bottom + left + right));
      variance += laplacian * laplacian;
      count++;
    }
  }

  const avgVariance = variance / count;
  
  // Normalize to 0-100 scale (empirically determined threshold)
  const score = Math.min(100, (avgVariance / 50) * 100);
  return score;
}

/**
 * Compute contrast score based on standard deviation
 */
export function computeContrastScore(imageData: ImageData): number {
  const data = imageData.data;
  let sum = 0;
  let sumSq = 0;
  const pixelCount = data.length / 4;

  // Sample every 10th pixel for performance
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    sum += brightness;
    sumSq += brightness * brightness;
  }

  const count = pixelCount / 10;
  const mean = sum / count;
  const variance = (sumSq / count) - (mean * mean);
  const stdDev = Math.sqrt(variance);

  // Good contrast typically has std dev between 40-70
  // Normalize to 0-100 scale
  const score = Math.min(100, (stdDev / 70) * 100);
  return score;
}

/**
 * Compute overall clarity score as weighted average
 */
export function computeClarity(
  lighting: number,
  sharpness: number,
  contrast: number
): number {
  // Weighted average: lighting 30%, sharpness 50%, contrast 20%
  const clarity = (lighting * 0.3) + (sharpness * 0.5) + (contrast * 0.2);
  return Math.round(clarity);
}

