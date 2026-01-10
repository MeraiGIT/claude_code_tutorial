'use client';

import { AnimatePresence } from 'framer-motion';
import { useLoadingState } from '@/hooks/useLoadingState';
import Loading from './Loading';

export default function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLoadingState();

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Loading key="loading" />}
      </AnimatePresence>
      {children}
    </>
  );
}
