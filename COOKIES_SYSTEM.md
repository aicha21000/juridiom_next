# Système de Gestion des Cookies

## 📋 Vue d'ensemble

Le site utilise un système de gestion des cookies conforme au RGPD avec deux catégories :

### ✅ Cookies Essentiels (Automatiquement Activés)
Ces cookies sont **nécessaires au fonctionnement du site** et sont activés **automatiquement sans demander le consentement** de l'utilisateur :

1. **`cart`** - Panier d'achat (stocke les services ajoutés)
2. **`mailClient`** - Email du client pour le suivi des commandes
3. **`token`** - Jeton d'authentification
4. **`user`** - Informations utilisateur connecté
5. **`darkMode`** - Préférence de thème (clair/sombre)
6. **`guestId`** - Identifiant pour les utilisateurs non connectés
7. **`cookieConsent`** - Niveau de consentement aux cookies

### 🎯 Cookies Optionnels (Nécessitent le Consentement)
Ces cookies nécessitent l'acceptation explicite de l'utilisateur :

1. **`analytics`** - Statistiques de visite
2. **`marketing`** - Publicités ciblées
3. **`preferences`** - Préférences avancées

## 🔧 Fonctionnement Technique

### Fichier: `src/utils/cookieUtils.ts`

```typescript
// Liste des cookies essentiels
const ESSENTIAL_COOKIES = ['cart', 'mailClient', 'token', 'user', 'darkMode', 'guestId'];

// Fonction pour créer un cookie avec respect du consentement
export const setCookieWithConsent = (name: string, value: string, options?) => {
  if (ESSENTIAL_COOKIES.includes(name)) {
    // Cookies essentiels - toujours autorisés
    Cookies.set(name, value, options);
    return true;
  }
  // ... gestion des cookies non essentiels
};
```

### Initialisation Automatique

Au chargement de la page, le système :
1. Vérifie si un consentement existe
2. Si non, crée automatiquement le consentement "essential"
3. Active tous les cookies essentiels (dont le panier)

```typescript
// Dans CookieBanner.tsx
useEffect(() => {
  const cookieConsent = Cookies.get('cookieConsent');
  if (!cookieConsent) {
    Cookies.set('cookieConsent', 'essential', { expires: 365 });
  }
}, []);
```

## 🛒 Panier d'Achat

Le cookie `cart` est **toujours actif** et ne nécessite **aucune action de l'utilisateur** :

- ✅ Créé automatiquement lors de l'ajout d'un service
- ✅ Persiste pendant 7 jours
- ✅ Synchronisé avec localStorage pour plus de fiabilité
- ✅ Aucune bannière de consentement pour ce cookie

### Exemple d'utilisation dans Services.tsx

```typescript
// Ajout au panier - pas besoin de vérifier le consentement
setCookieWithConsent("cart", JSON.stringify(updatedCart), { expires: 7, path: "/" });
localStorage.setItem("cart", JSON.stringify(updatedCart));
```

## 📱 Bannière de Cookies

La bannière affichée en bas de page :
- ✅ Informe que les cookies essentiels sont **déjà actifs**
- ✅ Propose d'activer les cookies optionnels (bouton "OK")
- ✅ Ne bloque **aucune fonctionnalité** du site

### Message affiché :
> "Cookies essentiels (panier, connexion) déjà actifs. Cliquez sur OK pour activer les cookies optionnels."

## 🔒 Conformité RGPD

Le système est conforme au RGPD car :
1. **Cookies essentiels** : Exemptés de consentement (Article 5(3) ePrivacy Directive)
2. **Cookies optionnels** : Consentement explicite requis
3. **Transparence** : Information claire sur les cookies utilisés
4. **Contrôle** : L'utilisateur peut refuser les cookies optionnels

## 📝 Résumé

**Le panier fonctionne sans que l'utilisateur ait besoin d'accepter quoi que ce soit.**

Les cookies du panier sont considérés comme strictement nécessaires au fonctionnement du site (permettre les achats) et sont donc automatiquement activés conformément aux réglementations RGPD.
