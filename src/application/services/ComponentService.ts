import { IComponentRepository } from '../../domain/repositories/IComponentRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ComponentSearchService } from '../../domain/services/ComponentSearchService';
import { SearchComponentsUseCase } from '../use-cases/component/SearchComponents';
import { GetComponentDetailsUseCase } from '../use-cases/component/GetComponentDetails';
import { ComponentDTO, ComponentSearchResultDTO, ComponentGenerationRequestDTO } from '../dtos/ComponentDTO';
import { SearchOptions } from '../../domain/repositories/IComponentRepository';

export interface IPreviewService {
  generatePreview(componentId: string, code: string): Promise<string>;
  getPreviewUrl(componentId: string): string;
}

export class ComponentService {
  private searchComponentsUseCase: SearchComponentsUseCase;
  private getComponentDetailsUseCase: GetComponentDetailsUseCase;
  
  constructor(
    private componentRepository: IComponentRepository,
    private userRepository: IUserRepository,
    private searchService: ComponentSearchService,
    private previewService: IPreviewService
  ) {
    this.searchComponentsUseCase = new SearchComponentsUseCase(
      componentRepository,
      userRepository,
      searchService
    );
    
    this.getComponentDetailsUseCase = new GetComponentDetailsUseCase(
      componentRepository,
      userRepository
    );
  }
  
  async searchComponents(
    options: SearchOptions,
    useSemanticSearch: boolean = false
  ): Promise<ComponentSearchResultDTO> {
    return this.searchComponentsUseCase.execute(options, useSemanticSearch);
  }
  
  async getComponent(componentId: string): Promise<ComponentDTO | null> {
    const component = await this.getComponentDetailsUseCase.execute(componentId);
    
    if (component) {
      // Attach preview URL
      component.previewUrl = this.previewService.getPreviewUrl(componentId);
      
      // Increment view/download counter
      await this.componentRepository.incrementDownloads(componentId);
    }
    
    return component;
  }
  
  async generateComponent(request: ComponentGenerationRequestDTO): Promise<ComponentDTO> {
    // This would integrate with AI service to generate component code
    throw new Error('AI generation not yet implemented');
  }
  
  async likeComponent(componentId: string, userId: string): Promise<void> {
    // Check if user can like (subscription limits, etc.)
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    await this.componentRepository.incrementLikes(componentId);
  }
  
  async getPopularComponents(limit: number = 10): Promise<ComponentDTO[]> {
    const components = await this.componentRepository.getPopular(limit);
    
    return Promise.all(
      components.map(async (component) => {
        const details = await this.getComponentDetailsUseCase.execute(component.id);
        return details!;
      })
    );
  }
  
  async getRecentComponents(limit: number = 10): Promise<ComponentDTO[]> {
    const components = await this.componentRepository.getRecent(limit);
    
    return Promise.all(
      components.map(async (component) => {
        const details = await this.getComponentDetailsUseCase.execute(component.id);
        return details!;
      })
    );
  }
  
  async getSimilarComponents(componentId: string, limit: number = 5): Promise<ComponentDTO[]> {
    const similarComponents = await this.searchService.findSimilar(componentId, limit);
    
    return Promise.all(
      similarComponents.map(async (component) => {
        const details = await this.getComponentDetailsUseCase.execute(component.id);
        return details!;
      })
    );
  }
}