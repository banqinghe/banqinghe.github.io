/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_ANALYZE: boolean;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
