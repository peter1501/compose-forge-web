import { IAuthProvider } from '../../application/services/AuthService';
import { AuthCredentials } from '../../application/use-cases/user/AuthenticateUser';
import { SupabaseClient } from './client';

export class SupabaseAuthProvider implements IAuthProvider {
  constructor(private supabase: SupabaseClient) {}
  
  async signIn(credentials: AuthCredentials): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
    
    return {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_in: data.session?.expires_in,
      user: data.user
    };
  }
  
  async signUp(credentials: AuthCredentials & { username?: string }): Promise<any> {
    const { data, error } = await this.supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          username: credentials.username
        }
      }
    });
    
    if (error) {
      throw new Error(`Sign up failed: ${error.message}`);
    }
    
    return {
      user: data.user,
      session: data.session
    };
  }
  
  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    
    if (error) {
      throw new Error(`Sign out failed: ${error.message}`);
    }
  }
  
  async refreshToken(refreshToken: string): Promise<any> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken
    });
    
    if (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
    
    return {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_in: data.session?.expires_in
    };
  }
  
  async resetPassword(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }
}