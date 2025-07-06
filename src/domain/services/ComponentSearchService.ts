import { Component } from '../entities/Component';

export interface ComponentSearchService {
  // Semantic search using AI embeddings
  searchBySimilarity(query: string, limit?: number): Promise<Component[]>;
  
  // Generate embeddings for a component
  generateEmbeddings(component: Component): Promise<number[]>;
  
  // Find similar components
  findSimilar(componentId: string, limit?: number): Promise<Component[]>;
  
  // Validate Material 3 compliance
  validateMaterial3Compliance(code: string): Promise<{
    compliant: boolean;
    issues: string[];
    suggestions: string[];
  }>;
  
  // Analyze accessibility
  analyzeAccessibility(code: string): Promise<{
    score: number;
    wcagLevel: 'A' | 'AA' | 'AAA' | 'None';
    issues: string[];
    recommendations: string[];
  }>;
}