import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) {
    console.error('FIREBASE_PRIVATE_KEY is not set in environment variables');
    return undefined;
  }

  // Remove any surrounding quotes
  let formattedKey = key.trim();
  if ((formattedKey.startsWith('"') && formattedKey.endsWith('"')) || 
      (formattedKey.startsWith("'") && formattedKey.endsWith("'"))) {
    formattedKey = formattedKey.slice(1, -1);
  }

  // Replace escaped newlines with actual newlines
  formattedKey = formattedKey.replace(/\\n/g, '\n');

  // Validate the key format
  if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----') || 
      !formattedKey.includes('-----END PRIVATE KEY-----')) {
    console.error('Invalid private key format. The key must be a valid PEM format.');
    console.error('Please ensure you have copied the entire "private_key" value from the Firebase service account JSON file.');
    console.error('The key should start with "-----BEGIN PRIVATE KEY-----" and end with "-----END PRIVATE KEY-----"');
    
    // Check if it might be a placeholder
    if (formattedKey.includes('YOUR-PRIVATE-KEY-HERE')) {
      console.error('⚠️  You are using a placeholder private key!');
      console.error('Please follow these steps:');
      console.error('1. Go to Firebase Console (https://console.firebase.google.com)');
      console.error('2. Select your project: tusreport');
      console.error('3. Go to Project Settings → Service Accounts');
      console.error('4. Click "Generate new private key"');
      console.error('5. Open the downloaded JSON file');
      console.error('6. Copy the entire "private_key" value (including \\n characters)');
      console.error('7. Paste it into .env.local as FIREBASE_PRIVATE_KEY="<paste-here>"');
    }
    
    return undefined;
  }

  return formattedKey;
}

let isInitialized = false;
let initError: Error | null = null;

export function isFirebaseConfigured(): boolean {
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  return !!(privateKey && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_CLIENT_EMAIL !== 'your-client-email-here');
}

export function initAdmin() {
  if (getApps().length > 0 || isInitialized) {
    return isInitialized;
  }

  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  
  if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL === 'your-client-email-here') {
    initError = new Error('Firebase Admin SDK cannot be initialized. Please check the console for setup instructions.');
    console.error(initError.message);
    return false;
  }

  try {
    const firebaseAdminConfig = {
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    };
    
    initializeApp(firebaseAdminConfig);
    isInitialized = true;
    return true;
  } catch (error) {
    initError = error as Error;
    console.error('Failed to initialize Firebase Admin:', error);
    return false;
  }
}

export const adminDb = () => {
  if (!initAdmin()) {
    throw initError || new Error('Firebase Admin SDK is not initialized');
  }
  return getFirestore();
};

export const adminAuth = () => {
  if (!initAdmin()) {
    throw initError || new Error('Firebase Admin SDK is not initialized');
  }
  return getAuth();
};