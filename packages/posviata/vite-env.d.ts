/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEDIA_URL: string;
  readonly VITE_HOST: 'node' | 'cf';
  readonly VITE_CF_TURNSTILE_SITEKEY: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
