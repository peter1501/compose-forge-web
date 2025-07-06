import { User, UserRole, SubscriptionPlan } from '../entities/User';

export interface IUserRepository {
  // CRUD operations
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  
  // Authentication
  getCurrentUser(): Promise<User | null>;
  
  // Subscription management
  updateSubscription(userId: string, plan: SubscriptionPlan): Promise<void>;
  incrementAiUsage(userId: string): Promise<void>;
  
  // User discovery
  searchAuthors(query: string, limit?: number): Promise<User[]>;
  getTopAuthors(limit?: number): Promise<User[]>;
  
  // Real-time subscriptions
  subscribeToUserUpdates(userId: string, callback: (user: User) => void): () => void;
}