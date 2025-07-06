import { Library, LibraryStats } from '../entities/Library';

export interface ILibraryRepository {
  // CRUD operations
  getById(id: string): Promise<Library | null>;
  create(library: Omit<Library, 'id' | 'createdAt' | 'updatedAt'>): Promise<Library>;
  update(id: string, updates: Partial<Library>): Promise<Library>;
  delete(id: string): Promise<void>;
  
  // Library discovery
  search(query: string, limit?: number): Promise<Library[]>;
  getByAuthor(authorId: string): Promise<Library[]>;
  getPublicLibraries(limit?: number, offset?: number): Promise<Library[]>;
  getPopular(limit?: number): Promise<Library[]>;
  
  // Component management
  addComponent(libraryId: string, componentId: string): Promise<void>;
  removeComponent(libraryId: string, componentId: string): Promise<void>;
  
  // Statistics
  getStats(libraryId: string): Promise<LibraryStats | null>;
  incrementStars(libraryId: string): Promise<void>;
  
  // Real-time subscriptions
  subscribeToLibraryUpdates(libraryId: string, callback: (library: Library) => void): () => void;
}