import * as admin from 'firebase-admin';

export function initializeFirebase() {
    if (!admin.apps.length) {
        try {
            let serviceAccount;
            if (process.env.FIREBASE_ADMIN_SDK_KEY) {
                serviceAccount = typeof process.env.FIREBASE_ADMIN_SDK_KEY === 'string'
                    ? JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY)
                    : process.env.FIREBASE_ADMIN_SDK_KEY;
            }

            if (serviceAccount) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL,
                    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET
                });
            }
        } catch (error) {
            console.error('Firebase admin initialization error', error);
        }
    }
    return admin;
}

export const firebaseAdmin = initializeFirebase();
