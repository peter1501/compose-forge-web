export interface UserDTO {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  githubUrl?: string;
  websiteUrl?: string;
  role: string;
  subscription: {
    tier: 'free' | 'pro' | 'team';
    aiGenerationsRemaining: number;
    aiGenerationsLimit: number;
    canCreatePrivateComponents: boolean;
    expiresAt?: string;
  };
  stats?: {
    componentsPublished: number;
    totalDownloads: number;
    averageRating: number;
  };
  createdAt: string;
}

export interface UserProfileUpdateDTO {
  displayName?: string;
  bio?: string;
  githubUrl?: string;
  websiteUrl?: string;
  avatarUrl?: string;
}

export interface UserPreferencesDTO {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  publicProfile: boolean;
  defaultLanguage: string;
}