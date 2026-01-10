'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setComponentLoaded: (component: string) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setComponentLoaded: () => {},
});

export const useLoadingState = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
  components?: string[];
}

export function LoadingProvider({
  children,
  components = ['ui', 'fonts']  // Removed 'scene' - 3D scene loads in background
}: LoadingProviderProps) {
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Check if ready to hide loading screen - purely component-driven
  useEffect(() => {
    const allComponentsLoaded = loadedComponents.size >= components.length;

    if (allComponentsLoaded) {
      // Very small delay (200ms) just for smooth fade transition
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [loadedComponents.size, components.length]);

  const setComponentLoaded = (component: string) => {
    setLoadedComponents((prev) => {
      const newSet = new Set(prev);
      newSet.add(component);
      return newSet;
    });
  };

  const contextValue = { isLoading, setComponentLoaded };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}
