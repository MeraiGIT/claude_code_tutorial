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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Minimum loading time for smooth transition and to allow scene to start loading (2 seconds)
    const minLoadingTime = setTimeout(() => {
      if (loadedComponents.size >= components.length) {
        setIsLoading(false);
      }
    }, 2000);

    return () => clearTimeout(minLoadingTime);
  }, [loadedComponents, components.length]);

  useEffect(() => {
    if (!mounted) return;

    // Check if all components are loaded
    if (loadedComponents.size >= components.length) {
      // Small delay before hiding loading screen for smooth transition
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [loadedComponents, components.length, mounted]);

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
