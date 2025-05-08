/**
 * Browser Normalization Utility
 *
 * This utility helps normalize rendering across different browsers,
 * particularly addressing zoom and scaling issues in Edge, Chrome, Firefox and other browsers.
 */

/**
 * Detects if the current browser is Microsoft Edge
 */
export const isEdgeBrowser = (): boolean => navigator.userAgent.indexOf('Edg') !== -1;

/**
 * Detects if the current browser is Chrome
 */
export const isChromeBrowser = (): boolean =>
  navigator.userAgent.indexOf('Chrome') !== -1 && !isEdgeBrowser();

/**
 * Detects if the current browser is Firefox
 */
export const isFirefoxBrowser = (): boolean => navigator.userAgent.indexOf('Firefox') !== -1;

/**
 * Gets the device pixel ratio to detect zoom level
 */
export const getDevicePixelRatio = (): number => window.devicePixelRatio || 1;

/**
 * Normalizes font rendering for different browsers
 * This function applies specific adjustments based on browser and zoom level
 */
export const normalizeFontRendering = (): void => {
  const pixelRatio = getDevicePixelRatio();
  let adjustment = '1';

  // Apply browser-specific adjustments
  if (isEdgeBrowser()) {
    adjustment = pixelRatio > 1 ? '0.95' : '0.975';
  } else if (isChromeBrowser()) {
    adjustment = pixelRatio > 1 ? '0.975' : '1';
  } else if (isFirefoxBrowser()) {
    adjustment = pixelRatio > 1 ? '0.975' : '1';
  }

  // Set the CSS variable for font adjustment
  document.documentElement.style.setProperty('--edge-font-adjustment', adjustment);

  // Add a data attribute to the html element for potential CSS targeting
  document.documentElement.setAttribute('data-browser-zoom', pixelRatio.toString());
};

/**
 * Initializes browser normalization
 * Call this function once when your application starts
 */
export const initBrowserNormalization = (): void => {
  // Apply browser-specific adjustments
  normalizeFontRendering();

  // Listen for zoom changes
  window.addEventListener('resize', () => {
    // Reapply normalizations on resize (which can be triggered by zoom)
    normalizeFontRendering();
  });
};

export default initBrowserNormalization;
