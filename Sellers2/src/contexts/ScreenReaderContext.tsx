import React, { createContext, useContext, ReactNode } from 'react';
import { useScreenReader } from '../hooks/useScreenReader';

interface ScreenReaderContextType {
  speak: (text: string, interrupt?: boolean) => void;
  readElement: (element: HTMLElement) => void;
  announcePageChange: (pageName: string) => void;
  announceNotification: (message: string) => void;
  announceError: (error: string) => void;
  announceSuccess: (message: string) => void;
  enabled: boolean;
}

const ScreenReaderContext = createContext<ScreenReaderContextType | null>(null);

interface ScreenReaderProviderProps {
  children: ReactNode;
  enabled: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function ScreenReaderProvider({ 
  children, 
  enabled,
  rate = 1.0,
  pitch = 1.0,
  volume = 1.0
}: ScreenReaderProviderProps) {
  const screenReader = useScreenReader({ enabled, rate, pitch, volume });

  return (
    <ScreenReaderContext.Provider value={{ ...screenReader, enabled }}>
      {children}
    </ScreenReaderContext.Provider>
  );
}

export function useScreenReaderContext() {
  const context = useContext(ScreenReaderContext);
  if (!context) {
    // Return a no-op implementation if provider is not found
    return {
      speak: () => {},
      readElement: () => {},
      announcePageChange: () => {},
      announceNotification: () => {},
      announceError: () => {},
      announceSuccess: () => {},
      enabled: false,
    };
  }
  return context;
}
