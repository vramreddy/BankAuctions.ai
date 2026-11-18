import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { CityProvider } from '../contexts/CityContext';
import { LanguageProvider } from '../i18n/LanguageContext';
import ScrollToTop from '../components/navigation/ScrollToTop';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <CityProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </CityProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
