import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { detectLocale, type Locale } from './geoLocale';
import ptMessages from './messages.pt';
import enMessages from './messages.en';
import type { Messages } from './messages.pt';
import { FullPageSpinner } from '@/components/ui/Spinner';

const STORAGE_KEY = 'nori-locale-override';

const dictionaries: Record<Locale, Messages> = {
  pt: ptMessages,
  en: enMessages,
};

interface LocaleContextValue {
  locale: Locale;
  t: Messages;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'pt' || stored === 'en') {
      setLocaleState(stored);
      return;
    }

    detectLocale().then(setLocaleState);
  }, []);

  function setLocale(next: Locale) {
    localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  }

  // Evita o "flash" de um idioma errado enquanto a geo-IP resolve — como a
  // tela de login é a primeira coisa renderizada, um spinner rápido aqui
  // não compromete a UX (a detecção costuma resolver em poucas centenas de ms).
  if (locale === null) {
    return <FullPageSpinner />;
  }

  return (
    <LocaleContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
}
