import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AuthenticateUserUseCase, AuthCredentials, AuthResult } from '../use-cases/user/AuthenticateUser';
import { UserDTO, UserProfileUpdateDTO } from '../dtos/UserDTO';

export interface IAuthProvider {
  signIn(credentials: AuthCredentials): Promise<any>;
  signUp(credentials: AuthCredentials & { username?: string }): Promise<any>;
  signOut(): Promise<void>;
  refreshToken(refreshToken: string): Promise<any>;
  resetPassword(email: string): Promise<void>;
}

export class AuthService {
  private authenticateUserUseCase: AuthenticateUserUseCase;
  
  constructor(
    private userRepository: IUserRepository,
    private authProvider: IAuthProvider
  ) {
    this.authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepository,
      authProvider
    );
  }
  
  async signIn(credentials: AuthCredentials): Promise<AuthResult> {
    return this.authenticateUserUseCase.execute(credentials);
  }
  
  async signUp(credentials: AuthCredentials & { username?: string }): Promise<AuthResult> {
    // Create auth account
    await this.authProvider.signUp(credentials);
    
    // Sign in to get tokens
    return this.signIn({
      email: credentials.email,
      password: credentials.password
    });
  }
  
  async signOut(): Promise<void> {
    await this.authProvider.signOut();
  }
  
  async getCurrentUser(): Promise<UserDTO | null> {
    const user = await this.userRepository.getCurrentUser();
    
    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      githubUrl: user.githubUrl,
      websiteUrl: user.websiteUrl,
      role: user.role,
      subscription: {
        tier: user.subscription.tier,
        aiGenerationsRemaining: user.subscription.aiGenerationsLimit - user.subscription.aiGenerationsUsed,
        aiGenerationsLimit: user.subscription.aiGenerationsLimit,
        canCreatePrivateComponents: user.subscription.tier !== 'free',
        expiresAt: user.subscription.expiresAt?.toISOString()
      },
      createdAt: user.createdAt.toISOString()
    };
  }
  
  async updateProfile(userId: string, updates: UserProfileUpdateDTO): Promise<UserDTO> {
    const updatedUser = await this.userRepository.update(userId, updates);
    
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      displayName: updatedUser.displayName,
      avatarUrl: updatedUser.avatarUrl,
      bio: updatedUser.bio,
      githubUrl: updatedUser.githubUrl,
      websiteUrl: updatedUser.websiteUrl,
      role: updatedUser.role,
      subscription: {
        tier: updatedUser.subscription.tier,
        aiGenerationsRemaining: updatedUser.subscription.aiGenerationsLimit - updatedUser.subscription.aiGenerationsUsed,
        aiGenerationsLimit: updatedUser.subscription.aiGenerationsLimit,
        canCreatePrivateComponents: updatedUser.subscription.tier !== 'free',
        expiresAt: updatedUser.subscription.expiresAt?.toISOString()
      },
      createdAt: updatedUser.createdAt.toISOString()
    };
  }
  
  async resetPassword(email: string): Promise<void> {
    await this.authProvider.resetPassword(email);
  }
}