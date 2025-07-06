'use client';

import { useState, useEffect, useCallback } from 'react';
import { useComponentService } from '../contexts/ServiceProvider';
import { ComponentDTO, ComponentSearchResultDTO } from '../../application/dtos/ComponentDTO';
import { SearchOptions } from '../../domain/repositories/IComponentRepository';

export function useComponentSearch() {
  const componentService = useComponentService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<ComponentSearchResultDTO | null>(null);
  
  const search = useCallback(async (
    options: SearchOptions,
    useSemanticSearch: boolean = false
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await componentService.searchComponents(options, useSemanticSearch);
      setResults(searchResults);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [componentService]);
  
  return { search, results, loading, error };
}

export function useComponent(componentId: string | null) {
  const componentService = useComponentService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [component, setComponent] = useState<ComponentDTO | null>(null);
  
  useEffect(() => {
    if (!componentId) {
      setComponent(null);
      return;
    }
    
    const fetchComponent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await componentService.getComponent(componentId);
        setComponent(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComponent();
  }, [componentId, componentService]);
  
  const likeComponent = useCallback(async (userId: string) => {
    if (!componentId) return;
    
    try {
      await componentService.likeComponent(componentId, userId);
      // Refresh component data
      const updated = await componentService.getComponent(componentId);
      setComponent(updated);
    } catch (err) {
      setError(err as Error);
    }
  }, [componentId, componentService]);
  
  return { component, loading, error, likeComponent };
}

export function usePopularComponents(limit: number = 10) {
  const componentService = useComponentService();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [components, setComponents] = useState<ComponentDTO[]>([]);
  
  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await componentService.getPopularComponents(limit);
        setComponents(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopular();
  }, [limit, componentService]);
  
  return { components, loading, error };
}

export function useRecentComponents(limit: number = 10) {
  const componentService = useComponentService();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [components, setComponents] = useState<ComponentDTO[]>([]);
  
  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await componentService.getRecentComponents(limit);
        setComponents(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecent();
  }, [limit, componentService]);
  
  return { components, loading, error };
}