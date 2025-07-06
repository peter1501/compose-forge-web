import { IComponentRepository, SearchOptions } from '../../../domain/repositories/IComponentRepository';
import { Component, ComponentMetrics } from '../../../domain/entities/Component';
import { SupabaseClient } from '../client';

export class SupabaseComponentRepository implements IComponentRepository {
  constructor(private supabase: SupabaseClient) {}
  
  async getById(id: string): Promise<Component | null> {
    const { data, error } = await this.supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return null;
    
    return this.mapToDomainEntity(data);
  }
  
  async create(component: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>): Promise<Component> {
    const { data, error } = await this.supabase
      .from('components')
      .insert({
        name: component.name,
        description: component.description,
        code: component.code,
        preview_code: component.previewCode,
        tags: component.tags,
        category: component.category,
        author_id: component.authorId,
        downloads: component.downloads,
        likes: component.likes,
        version: component.version,
        dependencies: component.dependencies,
        material3_compliant: component.material3Compliant,
        accessibility_score: component.accessibility.score,
        accessibility_issues: component.accessibility.issues,
        accessibility_wcag_level: component.accessibility.wcagLevel
      })
      .select()
      .single();
      
    if (error) throw new Error(`Failed to create component: ${error.message}`);
    
    return this.mapToDomainEntity(data);
  }
  
  async update(id: string, updates: Partial<Component>): Promise<Component> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.code !== undefined) updateData.code = updates.code;
    if (updates.previewCode !== undefined) updateData.preview_code = updates.previewCode;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.version !== undefined) updateData.version = updates.version;
    if (updates.dependencies !== undefined) updateData.dependencies = updates.dependencies;
    if (updates.material3Compliant !== undefined) updateData.material3_compliant = updates.material3Compliant;
    
    const { data, error } = await this.supabase
      .from('components')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(`Failed to update component: ${error.message}`);
    
    return this.mapToDomainEntity(data);
  }
  
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('components')
      .delete()
      .eq('id', id);
      
    if (error) throw new Error(`Failed to delete component: ${error.message}`);
  }
  
  async search(options: SearchOptions): Promise<Component[]> {
    let query = this.supabase.from('components').select('*');
    
    if (options.query) {
      query = query.textSearch('search_vector', options.query);
    }
    
    if (options.tags && options.tags.length > 0) {
      query = query.contains('tags', options.tags);
    }
    
    if (options.category) {
      query = query.eq('category', options.category);
    }
    
    if (options.authorId) {
      query = query.eq('author_id', options.authorId);
    }
    
    if (options.material3Only) {
      query = query.eq('material3_compliant', true);
    }
    
    if (options.minAccessibilityScore !== undefined) {
      query = query.gte('accessibility_score', options.minAccessibilityScore);
    }
    
    // Sorting
    switch (options.sortBy) {
      case 'downloads':
        query = query.order('downloads', { ascending: false });
        break;
      case 'likes':
        query = query.order('likes', { ascending: false });
        break;
      case 'date':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        // For relevance, rely on text search ranking
        break;
    }
    
    // Pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(`Search failed: ${error.message}`);
    
    return (data || []).map(this.mapToDomainEntity);
  }
  
  async searchWithVectors(query: string, limit: number = 20): Promise<Component[]> {
    // This would use pgvector for semantic search
    // For now, fallback to regular search
    return this.search({ query, limit });
  }
  
  async getByAuthor(authorId: string, limit: number = 20): Promise<Component[]> {
    return this.search({ authorId, limit });
  }
  
  async getPopular(limit: number = 20): Promise<Component[]> {
    return this.search({ sortBy: 'downloads', limit });
  }
  
  async getRecent(limit: number = 20): Promise<Component[]> {
    return this.search({ sortBy: 'date', limit });
  }
  
  async getMetrics(componentId: string): Promise<ComponentMetrics | null> {
    const { data, error } = await this.supabase
      .from('component_metrics')
      .select('*')
      .eq('component_id', componentId)
      .single();
      
    if (error || !data) return null;
    
    return {
      componentId: data.component_id,
      weeklyDownloads: data.weekly_downloads,
      monthlyDownloads: data.monthly_downloads,
      totalDownloads: data.total_downloads,
      averageRating: data.average_rating,
      totalRatings: data.total_ratings
    };
  }
  
  async incrementDownloads(componentId: string): Promise<void> {
    await this.supabase.rpc('increment_component_downloads', {
      component_id: componentId
    });
  }
  
  async incrementLikes(componentId: string): Promise<void> {
    await this.supabase.rpc('increment_component_likes', {
      component_id: componentId
    });
  }
  
  subscribeToUpdates(componentId: string, callback: (component: Component) => void): () => void {
    const subscription = this.supabase
      .channel(`component_${componentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'components',
          filter: `id=eq.${componentId}`
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
  
  subscribeToNewComponents(callback: (component: Component) => void): () => void {
    const subscription = this.supabase
      .channel('new_components')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'components'
        },
        (payload) => {
          callback(this.mapToDomainEntity(payload.new as any));
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }
  
  private mapToDomainEntity(data: any): Component {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      code: data.code,
      previewCode: data.preview_code,
      tags: data.tags || [],
      category: data.category,
      authorId: data.author_id,
      downloads: data.downloads || 0,
      likes: data.likes || 0,
      version: data.version,
      dependencies: data.dependencies || [],
      material3Compliant: data.material3_compliant || false,
      accessibility: {
        score: data.accessibility_score || 0,
        issues: data.accessibility_issues || [],
        wcagLevel: data.accessibility_wcag_level || 'None'
      },
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}