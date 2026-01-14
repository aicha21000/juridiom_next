import * as admin from 'firebase-admin';

/**
 * Initialise Firebase Admin de manière sécurisée (Singleton)
 */
const initializeFirebaseAdmin = () => {
    if (admin.apps.length > 0) {
        return admin;
    }

    try {
        const serviceAccountKey = process.env.FIREBASE_ADMIN_SDK_KEY;

        if (serviceAccountKey) {
            // Si la clé est une chaîne JSON (cas typique sur Vercel/Env)
            const serviceAccount = typeof serviceAccountKey === 'string'
                ? JSON.parse(serviceAccountKey)
                : serviceAccountKey;

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
            });
            console.log('✅ Firebase Admin initialisé avec succès');
        } else {
            console.warn('⚠️ FIREBASE_ADMIN_SDK_KEY manquante. Certaines fonctions serveur (Upload/Admin) ne fonctionneront pas.');
            // Initialisation minimale pour éviter les crashs immédiats au build
            admin.initializeApp({
                databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
            });
        }
    } catch (error) {
        console.error('❌ Erreur lors de l’initialisation de Firebase Admin:', error);
    }

    return admin;
};

export const firebaseAdmin = initializeFirebaseAdmin();
