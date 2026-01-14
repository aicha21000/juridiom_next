// services/firebase.ts - Correctif pour les API obsolètes
import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  off,
  update,
  get,
  connectDatabaseEmulator
} from 'firebase/database';
import { getAuth } from 'firebase/auth';

export interface Order {
  id: string;
  userId?: string;
  mailClient: string;
  numberOfPages: number;
  numberOfDocuments: number;
  deliveryMethod: string;
  legalization: string;
  totalPrice: number;
  status: 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  comment?: string;
  files?: Array<{ name: string; url: string; }>;
  stripeSessionId: string;
}

type Unsubscribe = () => void;

// Firebase configuration with type safety
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize database if URL is provided (optional for auth-only usage)
const database = firebaseConfig.databaseURL
  ? getDatabase(app)
  : null as any;

const auth = getAuth(app);

export { auth, database };

// Gestionnaire de session pour Firebase (simplifié car plus de chat)
class FirebaseSessionManager {
  private static listeners: Set<() => void> = new Set();

  public static initVisibilityHandler(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', FirebaseSessionManager.handleVisibilityChange);
    }
  }

  public static removeVisibilityHandler(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', FirebaseSessionManager.handleVisibilityChange);
    }
  }

  private static handleVisibilityChange(): void {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      FirebaseSessionManager.cleanupListeners();
    }
  }

  public static addListener(cleanup: () => void): void {
    FirebaseSessionManager.listeners.add(cleanup);
  }

  public static removeListener(cleanup: () => void): void {
    FirebaseSessionManager.listeners.delete(cleanup);
  }

  private static cleanupListeners(): void {
    FirebaseSessionManager.listeners.forEach(cleanup => cleanup());
    FirebaseSessionManager.listeners.clear();
  }
}

// Initialiser le gestionnaire de session uniquement côté client
if (typeof window !== 'undefined') {
  FirebaseSessionManager.initVisibilityHandler();
}

/**
 * Récupère toutes les commandes (pour l'admin)
 */
export const listenToAllOrders = (
  callback: (orders: Order[]) => void
): Unsubscribe => {
  const ordersRef = ref(database, 'orders');

  const unsubscribe = onValue(ordersRef, (snapshot) => {
    const orders: Order[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        orders.push({
          id: childSnapshot.key || '',
          ...childSnapshot.val()
        });
      });
    }
    // Trier par date décroissante
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(orders);
  });

  return () => off(ordersRef);
};

/**
 * Met à jour le statut d'une commande
 */
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<void> => {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    await update(orderRef, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export { FirebaseSessionManager };
