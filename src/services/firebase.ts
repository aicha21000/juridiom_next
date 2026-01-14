// services/firebase.ts - Correctif pour les API obsolètes

import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  off,
  push,
  set,
  query,
  orderByChild,
  update,
  DataSnapshot,
  remove,
  get,
  onChildAdded,
  onChildRemoved,
  onChildChanged,
  connectDatabaseEmulator
} from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Structure standardisée des messages
export interface Message {
  id?: string;
  content: string;
  email: string;  // 'admin', email utilisateur, ou 'guest'
  userId?: string | null;
  guestId?: string | null;
  createdAt: string;
  conversationId: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Notification {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
  read: boolean;
}

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

// Configuration de l'émulateur en développement (commenté pour utiliser la base réelle)
// if (process.env.NODE_ENV === 'development') {
//   connectDatabaseEmulator(database, 'localhost', 9000);
// }

// Gestionnaire de session pour Firebase
class FirebaseSessionManager {
  private static isOnline = true;
  private static listeners: Set<() => void> = new Set();

  // Méthode pour gérer les changements de visibilité de la page
  public static initVisibilityHandler(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', FirebaseSessionManager.handleVisibilityChange);
    }
  }

  // Méthode pour supprimer les gestionnaires d'événements
  public static removeVisibilityHandler(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', FirebaseSessionManager.handleVisibilityChange);
    }
  }

  // Méthode pour gérer les changements de visibilité
  private static handleVisibilityChange(): void {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      // La page est cachée, nettoyer les écouteurs
      FirebaseSessionManager.cleanupListeners();
    }
  }

  // Méthode pour ajouter un écouteur
  public static addListener(cleanup: () => void): void {
    FirebaseSessionManager.listeners.add(cleanup);
  }

  // Méthode pour supprimer un écouteur
  public static removeListener(cleanup: () => void): void {
    FirebaseSessionManager.listeners.delete(cleanup);
  }

  // Méthode pour nettoyer tous les écouteurs
  private static cleanupListeners(): void {
    FirebaseSessionManager.listeners.forEach(cleanup => cleanup());
    FirebaseSessionManager.listeners.clear();
  }

  // Vérifier si nous sommes en ligne
  public static isSessionActive(): boolean {
    return FirebaseSessionManager.isOnline;
  }
}

// Initialiser le gestionnaire de session uniquement côté client
if (typeof window !== 'undefined') {
  FirebaseSessionManager.initVisibilityHandler();
}

/**
 * Formats a DataSnapshot into a Notification object
 */
const formatNotification = (snapshot: DataSnapshot): Notification => ({
  id: snapshot.key || '',
  ...snapshot.val(),
  timestamp: snapshot.val().timestamp || Date.now(),
  read: snapshot.val().read || false
});

// Fonction pour encoder l'email en un identifiant valide pour Firebase
export const encodeEmail = (email: string): string => {
  return email.replace(/[.#$[\]@]/g, '_');
};

/**
 * Listens for new messages in a conversation
 */
export const listenToMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
): Unsubscribe => {
  const encodedId = encodeEmail(conversationId);
  const messagesRef = ref(database, `messages/${encodedId}`);

  try {
    const messages: Message[] = [];

    // Écouteur pour les nouveaux messages
    const addedUnsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const messageData = snapshot.val();
      const newMessage: Message = {
        id: snapshot.key || undefined,
        content: messageData.content,
        email: messageData.email,
        userId: messageData.userId,
        guestId: messageData.guestId,
        createdAt: messageData.createdAt,
        conversationId: encodedId
      };
      messages.push(newMessage);
      messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      callback([...messages]);
    });

    // Écouteur pour les messages supprimés
    const removedUnsubscribe = onChildRemoved(messagesRef, (snapshot) => {
      const index = messages.findIndex(msg => msg.id === snapshot.key);
      if (index !== -1) {
        messages.splice(index, 1);
        callback([...messages]);
      }
    });

    // Écouteur pour les messages modifiés
    const changedUnsubscribe = onChildChanged(messagesRef, (snapshot) => {
      const messageData = snapshot.val();
      const index = messages.findIndex(msg => msg.id === snapshot.key);
      if (index !== -1) {
        messages[index] = {
          id: snapshot.key || undefined,
          content: messageData.content,
          email: messageData.email,
          userId: messageData.userId,
          guestId: messageData.guestId,
          createdAt: messageData.createdAt,
          conversationId: encodedId
        };
        callback([...messages]);
      }
    });

    // Utiliser une fonction de nettoyage plus robuste
    return () => {
      // Désabonner des écouteurs spécifiques d'abord
      addedUnsubscribe();
      removedUnsubscribe();
      changedUnsubscribe();

      // Puis retirer l'écouteur général de la référence
      off(messagesRef);
    };
  } catch (error) {
    console.error('Error setting up message listener:', error);
    throw new Error('Failed to set up message listener');
  }
};

// Fonction modifiée pour envoyer un message
export const sendMessage = async (
  conversationId: string,
  messageData: Omit<Message, 'id' | 'conversationId'>
): Promise<string> => {
  const encodedId = encodeEmail(conversationId);
  const messagesRef = ref(database, `messages/${encodedId}`);
  const newMessageRef = push(messagesRef);

  const completeMessage = {
    ...messageData,
    conversationId: encodedId,
    createdAt: messageData.createdAt || new Date().toISOString()
  };

  try {
    // Envoyer le message
    await set(newMessageRef, completeMessage);

    // Créer ou mettre à jour la conversation
    const conversationRef = ref(database, `conversations/${encodedId}`);
    const conversationSnapshot = await get(conversationRef);

    if (!conversationSnapshot.exists()) {
      await set(conversationRef, {
        lastMessage: messageData.content,
        lastMessageTime: completeMessage.createdAt,
        email: messageData.email,
        createdAt: completeMessage.createdAt
      });
    } else {
      await update(conversationRef, {
        lastMessage: messageData.content,
        lastMessageTime: completeMessage.createdAt,
        email: messageData.email
      });
    }

    return newMessageRef.key || '';
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Updates message status (e.g., from 'sent' to 'delivered')
 */
export const updateMessageStatus = async (
  conversationId: string,
  messageId: string,
  status: Message['status']
): Promise<void> => {
  try {
    const encodedId = encodeEmail(conversationId);
    const messageRef = ref(database, `messages/${encodedId}/${messageId}`);
    await update(messageRef, { status });
  } catch (error) {
    console.error('Error updating message status:', error);
    throw new Error('Failed to update message status');
  }
};

/**
 * Listens for notifications for a specific user
 */
export const listenToNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void
): Unsubscribe => {
  try {
    const notificationsRef = ref(database, `notifications/${userId}`);
    const notificationsQuery = query(notificationsRef, orderByChild('timestamp'));

    const handleData = (snapshot: DataSnapshot) => {
      const notifications: Notification[] = [];
      snapshot.forEach((childSnapshot) => {
        notifications.push(formatNotification(childSnapshot));
      });
      notifications.sort((a, b) => b.timestamp - a.timestamp);
      callback(notifications);
    };

    const unsubscribe = onValue(notificationsQuery, handleData, (error) => {
      console.error('Error in notification listener:', error);
    });

    // Fonction de nettoyage
    const cleanup = () => {
      off(notificationsRef);
      unsubscribe();
    };

    // Ajouter le nettoyage au gestionnaire de session
    FirebaseSessionManager.addListener(cleanup);

    return () => {
      FirebaseSessionManager.removeListener(cleanup);
      cleanup();
    };
  } catch (error) {
    console.error('Error setting up notification listener:', error);
    throw new Error('Failed to set up notification listener');
  }
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (
  userId: string,
  notificationId: string
): Promise<void> => {
  try {
    const notificationRef = ref(database, `notifications/${userId}/${notificationId}`);
    await update(notificationRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read');
  }
};

/**
 * Sends a new notification to a user
 */
export const sendNotification = async (
  userId: string,
  type: string,
  data: Record<string, unknown>
): Promise<string> => {
  try {
    const notificationsRef = ref(database, `notifications/${userId}`);
    const newNotificationRef = push(notificationsRef);

    const notificationData = {
      type,
      data,
      timestamp: Date.now(),
      read: false
    };

    await set(newNotificationRef, notificationData);

    if (!newNotificationRef.key) {
      throw new Error('Failed to generate notification ID');
    }

    return newNotificationRef.key;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification');
  }
};

// Fonction modifiée pour lister les conversations
export const listenToConversations = (
  callback: (conversations: Array<{ id: string, lastMessage: string, lastMessageTime: string, email: string }>) => void
): Unsubscribe => {
  const conversationsRef = ref(database, 'conversations');

  const unsubscribe = onValue(conversationsRef, (snapshot) => {
    const conversations: Array<{ id: string, lastMessage: string, lastMessageTime: string, email: string }> = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const conv = childSnapshot.val();
        const originalId = childSnapshot.key;
        const encodedId = encodeEmail(originalId || '');

        if (conv && (conv.lastMessage || conv.email)) {
          const initiatorEmail = conv.email === 'admin' ?
            (conv.userId || conv.guestId || originalId) :
            conv.email;

          conversations.push({
            id: encodedId,
            lastMessage: conv.lastMessage || '',
            lastMessageTime: conv.lastMessageTime || '',
            email: initiatorEmail || 'Anonyme'
          });
        }
      });
    }

    callback(conversations);
  }, (error) => {
    console.error('Error in conversation listener:', error);
  });

  // Fonction de nettoyage
  const cleanup = () => {
    off(conversationsRef);
    unsubscribe();
  };

  // Ajouter le nettoyage au gestionnaire de session
  FirebaseSessionManager.addListener(cleanup);

  return () => {
    FirebaseSessionManager.removeListener(cleanup);
    cleanup();
  };
};

/**
 * Supprime un message spécifique
 */
export const deleteMessage = async (
  conversationId: string,
  messageId: string
): Promise<void> => {
  try {
    const encodedId = encodeEmail(conversationId);
    const messageRef = ref(database, `messages/${encodedId}/${messageId}`);
    await remove(messageRef);
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    throw new Error('Échec de la suppression du message');
  }
};

/**
 * Supprime une conversation et tous ses messages
 */
export const deleteConversation = async (
  conversationId: string
): Promise<void> => {
  try {
    // Supprimer la conversation
    const encodedId = encodeEmail(conversationId);
    const conversationRef = ref(database, `conversations/${encodedId}`);
    await remove(conversationRef);

    // Supprimer tous les messages de la conversation
    const messagesRef = ref(database, `messages/${encodedId}`);
    await remove(messagesRef);
  } catch (error) {
    console.error('Erreur lors de la suppression de la conversation:', error);
    throw new Error('Échec de la suppression de la conversation');
  }
};

// Fonction pour récupérer toutes les conversations
export const getAllConversations = async (): Promise<Record<string, Message[]>> => {
  const messagesRef = ref(database, 'messages');
  try {
    const snapshot = await get(messagesRef);
    const conversations: Record<string, Message[]> = {};

    if (snapshot.exists()) {
      snapshot.forEach((conversationSnapshot) => {
        const conversationId = conversationSnapshot.key;
        const messages: Message[] = [];

        conversationSnapshot.forEach((messageSnapshot) => {
          const messageData = messageSnapshot.val();
          messages.push({
            id: messageSnapshot.key,
            ...messageData
          });
        });

        if (messages.length > 0) {
          conversations[conversationId!] = messages;
        }
      });
    }

    return conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

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
