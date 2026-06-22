export type Locale = 'pt' | 'en';

const GEO_ENDPOINT = 'https://get.geojs.io/v1/ip/geo.json';
const GEO_TIMEOUT_MS = 2500;

async function detectCountryCode(): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);

    const response = await fetch(GEO_ENDPOINT, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json();
    // ex: "BR", "US", "PT"... duas letras, ISO 3166-1 alpha-2
    return typeof data.country_code === 'string' ? data.country_code : null;
  } catch {
    return null;
  }
}

function detectLocaleFromBrowser(): Locale {
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export async function detectLocale(): Promise<Locale> {
  const countryCode = await detectCountryCode();
  if (countryCode) {
    return countryCode === 'BR' ? 'pt' : 'en';
  }
  return detectLocaleFromBrowser();
}
