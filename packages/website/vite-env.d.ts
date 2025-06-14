/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEDIA_URL: string;
}

interface ImportMeta {
  readonly HOST: 'node' | 'cf';
  readonly env: ImportMetaEnv;
}
