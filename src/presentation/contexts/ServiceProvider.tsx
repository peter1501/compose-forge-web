'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Services } from '../../lib/di/container';
import { DIContainer } from '../../lib/di/container';
import { createClient } from '@/utils/supabase/client';

const ServiceContext = createContext<Services | null>(null);

export interface ServiceProviderProps {
  children: React.ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const [services, setServices] = useState<Services | null>(null);
  
  useEffect(() => {
    // Initialize DI container with Supabase client
    const supabase = createClient();
    const container = DIContainer.getInstance();
    container.initialize(supabase as any);
    setServices(container.getServices());
  }, []);
  
  if (!services) {
    return <div>Loading...</div>; // Or a proper loading component
  }
  
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices(): Services {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}

export function useComponentService() {
  const services = useServices();
  return services.componentService;
}

export function useAuthService() {
  const services = useServices();
  return services.authService;
}