import { Component, ComponentPreview, ComponentMetrics } from '../entities/Component';

export interface SearchOptions {
  query?: string;
  tags?: string[];
  category?: string;
  authorId?: string;
  material3Only?: boolean;
  minAccessibilityScore?: number;
  sortBy?: 'downloads' | 'likes' | 'date' | 'relevance';
  limit?: number;
  offset?: number;
}

export interface IComponentRepository {
  // CRUD operations
  getById(id: string): Promise<Component | null>;
  create(component: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>): Promise<Component>;
  update(id: string, updates: Partial<Component>): Promise<Component>;
  delete(id: string): Promise<void>;
  
  // Search and discovery
  search(options: SearchOptions): Promise<Component[]>;
  searchWithVectors(query: string, limit?: number): Promise<Component[]>;
  getByAuthor(authorId: string, limit?: number): Promise<Component[]>;
  getPopular(limit?: number): Promise<Component[]>;
  getRecent(limit?: number): Promise<Component[]>;
  
  // Metrics and analytics
  getMetrics(componentId: string): Promise<ComponentMetrics | null>;
  incrementDownloads(componentId: string): Promise<void>;
  incrementLikes(componentId: string): Promise<void>;
  
  // Real-time subscriptions
  subscribeToUpdates(componentId: string, callback: (component: Component) => void): () => void;
  subscribeToNewComponents(callback: (component: Component) => void): () => void;
}