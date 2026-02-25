/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_CALLBACK_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_EMAIL_REGEX: RegExp;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
