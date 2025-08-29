import { isFirebaseConfigured, adminDb } from './firebase-config';
import type { Timestamp } from 'firebase-admin/firestore';

export interface User {
  id: string;
  email: string;
  password: string;
  name?: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationToken {
  id: string;
  token: string;
  expires: Date;
  userId: string;
  createdAt: Date;
}

export const collections = {
  users: 'users',
  verificationTokens: 'verificationTokens',
};

// Helper function to check if Firebase is configured
function checkFirebaseConfig() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. Please complete the Firebase setup.');
  }
}

// Lazy load Timestamp when needed
async function getTimestamp() {
  const { Timestamp } = await import('firebase-admin/firestore');
  return Timestamp;
}

export const userService = {
  async create(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    checkFirebaseConfig();
    const db = adminDb();
    const Timestamp = await getTimestamp();
    
    const userRef = db.collection(collections.users).doc();
    const now = Timestamp.now().toDate();
    
    const userData: User = {
      id: userRef.id,
      email: data.email,
      password: data.password,
      name: data.name || null,
      emailVerified: null,
      createdAt: now,
      updatedAt: now,
    };
    
    await userRef.set(userData);
    return userData;
  },

  async findByEmail(email: string): Promise<User | null> {
    checkFirebaseConfig();
    const db = adminDb();
    const snapshot = await db
      .collection(collections.users)
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      email: data.email,
      password: data.password,
      name: data.name || null,
      emailVerified: data.emailVerified?.toDate() || null,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  },

  async findById(id: string): Promise<User | null> {
    checkFirebaseConfig();
    const db = adminDb();
    const doc = await db.collection(collections.users).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data()!;
    
    return {
      id: doc.id,
      email: data.email,
      password: data.password,
      name: data.name || null,
      emailVerified: data.emailVerified?.toDate() || null,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  },

  async update(id: string, data: Partial<User>): Promise<void> {
    checkFirebaseConfig();
    const db = adminDb();
    const Timestamp = await getTimestamp();
    
    const updateData: any = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    
    if (data.emailVerified) {
      updateData.emailVerified = Timestamp.fromDate(data.emailVerified);
    }
    
    await db.collection(collections.users).doc(id).update(updateData);
  },

  async verifyEmail(userId: string): Promise<void> {
    checkFirebaseConfig();
    const db = adminDb();
    const Timestamp = await getTimestamp();
    
    await db.collection(collections.users).doc(userId).update({
      emailVerified: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  },
};

export const verificationTokenService = {
  async create(userId: string, token: string): Promise<VerificationToken> {
    checkFirebaseConfig();
    const db = adminDb();
    const Timestamp = await getTimestamp();
    
    const tokenRef = db.collection(collections.verificationTokens).doc();
    const now = Timestamp.now().toDate();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    
    const tokenData: VerificationToken = {
      id: tokenRef.id,
      token,
      userId,
      expires,
      createdAt: now,
    };
    
    await tokenRef.set({
      ...tokenData,
      expires: Timestamp.fromDate(expires),
      createdAt: Timestamp.fromDate(now),
    });
    
    return tokenData;
  },

  async findByToken(token: string): Promise<VerificationToken | null> {
    checkFirebaseConfig();
    const db = adminDb();
    
    const snapshot = await db
      .collection(collections.verificationTokens)
      .where('token', '==', token)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      token: data.token,
      userId: data.userId,
      expires: data.expires?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  },

  async delete(id: string): Promise<void> {
    checkFirebaseConfig();
    const db = adminDb();
    await db.collection(collections.verificationTokens).doc(id).delete();
  },

  async deleteExpired(): Promise<void> {
    checkFirebaseConfig();
    const db = adminDb();
    const Timestamp = await getTimestamp();
    
    const snapshot = await db
      .collection(collections.verificationTokens)
      .where('expires', '<', Timestamp.now())
      .get();
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  },
};