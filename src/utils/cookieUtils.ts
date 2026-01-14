import Cookies from 'js-cookie';

// Types de consentement
export type CookieConsent = 'essential' | 'all' | null;

// Cookies essentiels (toujours créés)
const ESSENTIAL_COOKIES = ['cart', 'mailClient', 'token', 'user', 'darkMode', 'guestId'];

// Cookies non essentiels (nécessitent le consentement 'all')
const NON_ESSENTIAL_COOKIES = ['analytics', 'marketing', 'preferences'];

/**
 * Vérifie si les cookies essentiels peuvent être créés
 */
export const canSetEssentialCookies = (): boolean => {
  const consent = Cookies.get('cookieConsent') as CookieConsent;
  return consent === 'essential' || consent === 'all';
};

/**
 * Vérifie si les cookies non essentiels peuvent être créés
 */
export const canSetNonEssentialCookies = (): boolean => {
  const consent = Cookies.get('cookieConsent') as CookieConsent;
  return consent === 'all';
};

/**
 * Crée automatiquement le consentement pour les cookies essentiels si nécessaire
 */
export const ensureEssentialConsent = (): void => {
  const consent = Cookies.get('cookieConsent') as CookieConsent;
  if (!consent) {
    Cookies.set('cookieConsent', 'essential', { expires: 365 });
  }
};

/**
 * Définit un cookie en respectant le consentement
 */
export const setCookieWithConsent = (
  name: string, 
  value: string, 
  options?: { expires?: number; path?: string }
): boolean => {
  if (ESSENTIAL_COOKIES.includes(name)) {
    // Cookies essentiels - toujours autorisés
    Cookies.set(name, value, options);
    return true;
  } else if (NON_ESSENTIAL_COOKIES.includes(name)) {
    // Cookies non essentiels - nécessitent le consentement 'all'
    if (canSetNonEssentialCookies()) {
      Cookies.set(name, value, options);
      return true;
    }
    return false;
  } else {
    // Cookies inconnus - traiter comme essentiels par défaut
    Cookies.set(name, value, options);
    return true;
  }
};

/**
 * Obtient le consentement actuel
 */
export const getCookieConsent = (): CookieConsent => {
  return Cookies.get('cookieConsent') as CookieConsent;
};
