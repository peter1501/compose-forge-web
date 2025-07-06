import { IComponentRepository } from '../../domain/repositories/IComponentRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ILibraryRepository } from '../../domain/repositories/ILibraryRepository';
import { ComponentSearchService } from '../../domain/services/ComponentSearchService';
import { ComponentService, IPreviewService } from '../../application/services/ComponentService';
import { AuthService, IAuthProvider } from '../../application/services/AuthService';
import { SupabaseComponentRepository } from '../../infrastructure/supabase/repositories/SupabaseComponentRepository';
import { SupabaseUserRepository } from '../../infrastructure/supabase/repositories/SupabaseUserRepository';
import { SupabaseAuthProvider } from '../../infrastructure/supabase/SupabaseAuthProvider';
import { getSupabaseClient, SupabaseClient } from '../../infrastructure/supabase/client';

export interface Services {
  componentService: ComponentService;
  authService: AuthService;
}

export interface Repositories {
  componentRepository: IComponentRepository;
  userRepository: IUserRepository;
  libraryRepository: ILibraryRepository;
}

class MockPreviewService implements IPreviewService {
  async generatePreview(componentId: string, code: string): Promise<string> {
    // Mock implementation
    return `https://preview.composeforge.com/${componentId}`;
  }
  
  getPreviewUrl(componentId: string): string {
    return `https://preview.composeforge.com/${componentId}`;
  }
}

class MockComponentSearchService implements ComponentSearchService {
  async searchBySimilarity(query: string, limit?: number): Promise<any[]> {
    // Mock implementation
    return [];
  }
  
  async generateEmbeddings(component: any): Promise<number[]> {
    // Mock implementation
    return [];
  }
  
  async findSimilar(componentId: string, limit?: number): Promise<any[]> {
    // Mock implementation
    return [];
  }
  
  async validateMaterial3Compliance(code: string): Promise<any> {
    // Mock implementation
    return {
      compliant: true,
      issues: [],
      suggestions: []
    };
  }
  
  async analyzeAccessibility(code: string): Promise<any> {
    // Mock implementation
    return {
      score: 85,
      wcagLevel: 'AA' as const,
      issues: [],
      recommendations: []
    };
  }
}

export class DIContainer {
  private static instance: DIContainer;
  private services: Services | null = null;
  private repositories: Repositories | null = null;
  private supabaseClient: SupabaseClient | null = null;
  
  private constructor() {}
  
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }
  
  initialize(supabaseClient?: SupabaseClient): void {
    this.supabaseClient = supabaseClient || getSupabaseClient();
    
    // Initialize repositories
    const componentRepository = new SupabaseComponentRepository(this.supabaseClient);
    const userRepository = new SupabaseUserRepository(this.supabaseClient);
    
    this.repositories = {
      componentRepository,
      userRepository,
      libraryRepository: null as any // TODO: Implement library repository
    };
    
    // Initialize services
    const authProvider = new SupabaseAuthProvider(this.supabaseClient);
    const searchService = new MockComponentSearchService();
    const previewService = new MockPreviewService();
    
    const componentService = new ComponentService(
      componentRepository,
      userRepository,
      searchService,
      previewService
    );
    
    const authService = new AuthService(
      userRepository,
      authProvider
    );
    
    this.services = {
      componentService,
      authService
    };
  }
  
  getServices(): Services {
    if (!this.services) {
      throw new Error('DI Container not initialized. Call initialize() first.');
    }
    return this.services;
  }
  
  getRepositories(): Repositories {
    if (!this.repositories) {
      throw new Error('DI Container not initialized. Call initialize() first.');
    }
    return this.repositories;
  }
  
  getSupabaseClient(): SupabaseClient {
    if (!this.supabaseClient) {
      throw new Error('DI Container not initialized. Call initialize() first.');
    }
    return this.supabaseClient;
  }
}