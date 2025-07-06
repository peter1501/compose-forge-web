import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User, UserRole, SubscriptionPlan } from '../../../domain/entities/User';
import { SupabaseClient } from '../client';

export class SupabaseUserRepository implements IUserRepository {
  constructor(private supabase: SupabaseClient) {}
  
  async getById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return null;
    
    return this.mapToDomainEntity(data);
  }
  
  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error || !data) return null;
    
    return this.mapToDomainEntity(data);
  }
  
  async getByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
      
    if (error || !data) return null;
    
    return this.mapToDomainEntity(data);
  }
  
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        email: user.email,
        username: user.username,
        display_name: user.displayName,
        avatar_url: user.avatarUrl,
        bio: user.bio,
        github_url: user.githubUrl,
        website_url: user.websiteUrl,
        role: user.role,
        subscription_tier: user.subscription.tier,
        ai_generations_used: user.subscription.aiGenerationsUsed,
        ai_generations_limit: user.subscription.aiGenerationsLimit,
        private_components_count: user.subscription.privateComponentsCount,
        subscription_expires_at: user.subscription.expiresAt,
        theme_preference: user.preferences.theme,
        email_notifications: user.preferences.emailNotifications,
        public_profile: user.preferences.publicProfile,
        default_language: user.preferences.defaultLanguage
      })
      .select()
      .single();
      
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    
    return this.mapToDomainEntity(data);
  }
  
  async update(id: string, updates: Partial<User>): Promise<User> {
    const updateData: any = {};
    
    if (updates.displayName !== undefined) updateData.display_name = updates.displayName;
    if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.githubUrl !== undefined) updateData.github_url = updates.githubUrl;
    if (updates.websiteUrl !== undefined) updateData.website_url = updates.websiteUrl;
    if (updates.role !== undefined) updateData.role = updates.role;
    
    if (updates.subscription) {
      if (updates.subscription.tier !== undefined) updateData.subscription_tier = updates.subscription.tier;
      if (updates.subscription.aiGenerationsUsed !== undefined) updateData.ai_generations_used = updates.subscription.aiGenerationsUsed;
      if (updates.subscription.aiGenerationsLimit !== undefined) updateData.ai_generations_limit = updates.subscription.aiGenerationsLimit;
      if (updates.subscription.privateComponentsCount !== undefined) updateData.private_components_count = updates.subscription.privateComponentsCount;
      if (updates.subscription.expiresAt !== undefined) updateData.subscription_expires_at = updates.subscription.expiresAt;
    }
    
    if (updates.preferences) {
      if (updates.preferences.theme !== undefined) updateData.theme_preference = updates.preferences.theme;
      if (updates.preferences.emailNotifications !== undefined) updateData.email_notifications = updates.preferences.emailNotifications;
      if (updates.preferences.publicProfile !== undefined) updateData.public_profile = updates.preferences.publicProfile;
      if (updates.preferences.defaultLanguage !== undefined) updateData.default_language = updates.preferences.defaultLanguage;
    }
    
    const { data, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(`Failed to update user: ${error.message}`);
    
    return this.mapToDomainEntity(data);
  }
  
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id);
      
    if (error) throw new Error(`Failed to delete user: ${error.message}`);
  }
  
  async getCurrentUser(): Promise<User | null> {
    const { data: { user: authUser } } = await this.supabase.auth.getUser();
    
    if (!authUser) return null;
    
    return this.getById(authUser.id);
  }
  
  async updateSubscription(userId: string, plan: SubscriptionPlan): Promise<void> {
    await this.update(userId, { subscription: plan });
  }
  
  async incrementAiUsage(userId: string): Promise<void> {
    await this.supabase.rpc('increment_ai_usage', {
      user_id: userId
    });
  }
  
  async searchAuthors(query: string, limit: number = 20): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .in('role', [UserRole.AUTHOR, UserRole.ADMIN])
      .limit(limit);
      
    if (error) throw new Error(`Search failed: ${error.message}`);
    
    return (data || []).map(this.mapToDomainEntity);
  }
  
  async getTopAuthors(limit: number = 20): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .in('role', [UserRole.AUTHOR, UserRole.ADMIN])
      .order('total_downloads', { ascending: false })
      .limit(limit);
      
    if (error) throw new Error(`Failed to get top authors: ${error.message}`);
    
    return (data || []).map(this.mapToDomainEntity);
  }
  
  subscribeToUserUpdates(userId: string, callback: (user: User) => void): () => void {
    const subscription = this.supabase
      .channel(`user_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          if (payload.new) {
            callback(this.mapToDomainEntity(payload.new as any));
          }
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }
  
  private mapToDomainEntity(data: any): User {
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      githubUrl: data.github_url,
      websiteUrl: data.website_url,
      role: data.role as UserRole,
      subscription: {
        tier: data.subscription_tier,
        aiGenerationsUsed: data.ai_generations_used || 0,
        aiGenerationsLimit: data.ai_generations_limit || 10,
        privateComponentsCount: data.private_components_count || 0,
        expiresAt: data.subscription_expires_at ? new Date(data.subscription_expires_at) : undefined
      },
      preferences: {
        theme: data.theme_preference || 'system',
        emailNotifications: data.email_notifications ?? true,
        publicProfile: data.public_profile ?? true,
        defaultLanguage: data.default_language || 'en'
      },
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}