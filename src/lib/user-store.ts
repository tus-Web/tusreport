import bcrypt from 'bcryptjs';

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

// In-memory stores
const users: Map<string, User> = new Map();
const verificationTokens: Map<string, VerificationToken> = new Map();

// Initialize with demo users
async function initializeDemoUsers() {
  const demoPassword = await bcrypt.hash('demo123', 10);
  
  // Demo user 1
  users.set('demo-user-1', {
    id: 'demo-user-1',
    email: 'demo@example.com',
    password: demoPassword,
    name: 'Demo User',
    emailVerified: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // TUS student demo user
  const tusPassword = await bcrypt.hash('tus12345', 10);
  users.set('tus-user-1', {
    id: 'tus-user-1',
    email: 'test@ed.tus.ac.jp',
    password: tusPassword,
    name: 'TUS Student',
    emailVerified: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// Initialize demo users on module load
initializeDemoUsers();

export const userService = {
  async create(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user: User = {
      id,
      email: data.email,
      password: hashedPassword,
      name: data.name || null,
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    users.set(id, user);
    return user;
  },

  async findByEmail(email: string): Promise<User | null> {
    for (const user of users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  },

  async findById(id: string): Promise<User | null> {
    return users.get(id) || null;
  },

  async update(id: string, data: Partial<User>): Promise<void> {
    const user = users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...user,
      ...data,
      id: user.id, // Ensure ID cannot be changed
      updatedAt: new Date(),
    };
    
    users.set(id, updatedUser);
  },

  async verifyEmail(userId: string): Promise<void> {
    const user = users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    user.emailVerified = new Date();
    user.updatedAt = new Date();
    users.set(userId, user);
  },

  async deleteUser(id: string): Promise<void> {
    users.delete(id);
  },

  async getAllUsers(): Promise<User[]> {
    return Array.from(users.values());
  },
};

export const verificationTokenService = {
  async create(userId: string, token: string): Promise<VerificationToken> {
    const id = `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tokenData: VerificationToken = {
      id,
      token,
      userId,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
    };
    
    verificationTokens.set(id, tokenData);
    return tokenData;
  },

  async findByToken(token: string): Promise<VerificationToken | null> {
    for (const tokenData of verificationTokens.values()) {
      if (tokenData.token === token) {
        return tokenData;
      }
    }
    return null;
  },

  async delete(id: string): Promise<void> {
    verificationTokens.delete(id);
  },

  async deleteExpired(): Promise<void> {
    const now = new Date();
    for (const [id, token] of verificationTokens.entries()) {
      if (token.expires < now) {
        verificationTokens.delete(id);
      }
    }
  },
};