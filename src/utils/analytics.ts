import { canSetNonEssentialCookies, setCookieWithConsent } from './cookieUtils';

/**
 * Exemple d'analytics qui nécessite le consentement pour les cookies non essentiels
 */
export const trackPageView = (page: string): void => {
  if (canSetNonEssentialCookies()) {
    // Simuler un tracking d'analytics
    console.log(`Analytics: Page view tracked for ${page}`);
    
    // Créer un cookie d'analytics
    setCookieWithConsent('analytics', JSON.stringify({
      lastPage: page,
      timestamp: new Date().toISOString()
    }), { expires: 30 });
  }
};

/**
 * Exemple de tracking d'événements
 */
export const trackEvent = (eventName: string, data?: any): void => {
  if (canSetNonEssentialCookies()) {
    console.log(`Analytics: Event tracked - ${eventName}`, data);
    
    // Stocker les événements dans un cookie
    const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    existingEvents.push({
      event: eventName,
      data,
      timestamp: new Date().toISOString()
    });
    
    // Garder seulement les 10 derniers événements
    if (existingEvents.length > 10) {
      existingEvents.splice(0, existingEvents.length - 10);
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(existingEvents));
  }
};

/**
 * Exemple de préférences utilisateur (cookies non essentiels)
 */
export const saveUserPreference = (key: string, value: any): void => {
  if (canSetNonEssentialCookies()) {
    setCookieWithConsent('preferences', JSON.stringify({
      [key]: value,
      updatedAt: new Date().toISOString()
    }), { expires: 365 });
  }
};
