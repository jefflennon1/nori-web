import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';
import { Toaster } from './components/ui/Toaster.tsx';
import { LocaleProvider } from './i18n/LocaleContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </LocaleProvider>
    </QueryClientProvider>
  </StrictMode>
);
