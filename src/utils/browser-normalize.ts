/**
 * Browser Normalization Utility
 * 
 * This utility helps normalize rendering across different browsers,
 * particularly addressing zoom and scaling issues in Edge and other browsers.
 */

/**
 * Detects if the current browser is Microsoft Edge
 */
export const isEdgeBrowser = (): boolean => navigator.userAgent.indexOf('Edg') !== -1;

/**
 * Normalizes font rendering for Edge browser
 * This function applies specific adjustments for Edge browser
 */
export const normalizeEdgeFontRendering = (): void => {
  if (isEdgeBrowser()) {
    // Add Edge-specific CSS variables if needed
    document.documentElement.style.setProperty('--edge-font-adjustment', '0.975');
  } else {
    document.documentElement.style.setProperty('--edge-font-adjustment', '1');
  }
};

/**
 * Initializes browser normalization
 * Call this function once when your application starts
 */
export const initBrowserNormalization = (): void => {
  // Apply browser-specific adjustments
  normalizeEdgeFontRendering();
  
  // Listen for zoom changes
  window.addEventListener('resize', () => {
    // Reapply normalizations on resize (which can be triggered by zoom)
    normalizeEdgeFontRendering();
  });
};

export default initBrowserNormalization;
