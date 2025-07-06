import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserDTO } from '../../dtos/UserDTO';
import { User, UserRole } from '../../../domain/entities/User';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: UserDTO;
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
}

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: any // Will be implemented in infrastructure layer
  ) {}

  async execute(credentials: AuthCredentials): Promise<AuthResult> {
    // Delegate authentication to Supabase through authService
    const authResult = await this.authService.signIn(credentials);
    
    // Get or create user profile
    let user = await this.userRepository.getByEmail(credentials.email);
    
    if (!user) {
      // Create new user profile
      user = await this.userRepository.create({
        email: credentials.email,
        username: this.generateUsername(credentials.email),
        role: UserRole.USER,
        subscription: {
          tier: 'free',
          aiGenerationsUsed: 0,
          aiGenerationsLimit: 10,
          privateComponentsCount: 0
        },
        preferences: {
          theme: 'system',
          emailNotifications: true,
          publicProfile: true,
          defaultLanguage: 'en'
        }
      });
    }
    
    return {
      user: this.mapToDTO(user),
      session: {
        accessToken: authResult.access_token,
        refreshToken: authResult.refresh_token,
        expiresAt: new Date(Date.now() + authResult.expires_in * 1000).toISOString()
      }
    };
  }
  
  private generateUsername(email: string): string {
    const baseUsername = email.split('@')[0];
    return `${baseUsername}_${Date.now()}`;
  }
  
  private mapToDTO(user: User): UserDTO {
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
}