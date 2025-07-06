import { IComponentRepository } from '../../../domain/repositories/IComponentRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ComponentDTO } from '../../dtos/ComponentDTO';

export class GetComponentDetailsUseCase {
  constructor(
    private componentRepository: IComponentRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(componentId: string): Promise<ComponentDTO | null> {
    const component = await this.componentRepository.getById(componentId);
    
    if (!component) {
      return null;
    }
    
    const [author, metrics] = await Promise.all([
      this.userRepository.getById(component.authorId),
      this.componentRepository.getMetrics(componentId)
    ]);
    
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