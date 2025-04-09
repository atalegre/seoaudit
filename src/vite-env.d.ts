
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAGESPEED_API_KEY: string;
  // Outras variáveis de ambiente podem ser adicionadas aqui
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
