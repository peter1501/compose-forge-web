import { IComponentRepository, SearchOptions } from '../../../domain/repositories/IComponentRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ComponentSearchService } from '../../../domain/services/ComponentSearchService';
import { ComponentDTO, ComponentSearchResultDTO } from '../../dtos/ComponentDTO';
import { Component } from '../../../domain/entities/Component';

export class SearchComponentsUseCase {
  constructor(
    private componentRepository: IComponentRepository,
    private userRepository: IUserRepository,
    private searchService: ComponentSearchService
  ) {}

  async execute(
    searchOptions: SearchOptions,
    useSemanticSearch: boolean = false
  ): Promise<ComponentSearchResultDTO> {
    let components: Component[];
    
    if (useSemanticSearch && searchOptions.query) {
      // Use AI-powered semantic search
      components = await this.searchService.searchBySimilarity(
        searchOptions.query,
        searchOptions.limit
      );
    } else {
      // Use traditional search
      components = await this.componentRepository.search(searchOptions);
    }
    
    // Enrich with author information
    const componentDTOs = await Promise.all(
      components.map(async (component) => {
        const author = await this.userRepository.getById(component.authorId);
        const metrics = await this.componentRepository.getMetrics(component.id);
        
        return this.mapToDTO(component, author, metrics);
      })
    );
    
    return {
      components: componentDTOs,
      totalCount: componentDTOs.length,
      hasMore: componentDTOs.length === (searchOptions.limit || 20)
    };
  }
  
  private mapToDTO(
    component: Component,
    author: any,
    metrics: any
  ): ComponentDTO {
    return {
      id: component.id,
      name: component.name,
      description: component.description,
      code: component.code,
      tags: component.tags,
      category: component.category,
      author: {
        id: author?.id || '',
        username: author?.username || 'Unknown',
        displayName: author?.displayName,
        avatarUrl: author?.avatarUrl
      },
      stats: {
        downloads: metrics?.totalDownloads || 0,
        likes: component.likes,
        rating: metrics?.averageRating || 0,
        totalRatings: metrics?.totalRatings || 0
      },
      material3Compliant: component.material3Compliant,
      accessibilityScore: component.accessibility.score,
      version: component.version,
      createdAt: component.createdAt.toISOString(),
      updatedAt: component.updatedAt.toISOString()
    };
  }
}