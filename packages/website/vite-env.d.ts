/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEDIA_URL: string;
  readonly VITE_CF_TURNSTILE_SITEKEY: string;
}

interface ImportMeta {
  readonly HOST: 'node' | 'cf';
  readonly env: ImportMetaEnv;
}
