export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  githubUrl?: string;
  websiteUrl?: string;
  role: UserRole;
  subscription: SubscriptionPlan;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'user',
  AUTHOR = 'author',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export interface SubscriptionPlan {
  tier: 'free' | 'pro' | 'team';
  aiGenerationsUsed: number;
  aiGenerationsLimit: number;
  privateComponentsCount: number;
  expiresAt?: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  publicProfile: boolean;
  defaultLanguage: string;
}