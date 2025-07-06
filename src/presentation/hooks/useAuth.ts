'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthService } from '../contexts/ServiceProvider';
import { UserDTO } from '../../application/dtos/UserDTO';
import { AuthCredentials, AuthResult } from '../../application/use-cases/user/AuthenticateUser';

export function useAuth() {
  const authService = useAuthService();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [authService]);
  
  const signIn = useCallback(async (credentials: AuthCredentials): Promise<AuthResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.signIn(credentials);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authService]);
  
  const signUp = useCallback(async (
    credentials: AuthCredentials & { username?: string }
  ): Promise<AuthResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.signUp(credentials);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authService]);
  
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signOut();
      setUser(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authService]);
  
  const updateProfile = useCallback(async (updates: any) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updated = await authService.updateProfile(user.id, updates);
      setUser(updated);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [authService, user]);
  
  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  };
}