// Example template for local config. Copy this file to
// `src/app/config/app.config.local.ts` and fill in real values. Do NOT
// commit `app.config.local.ts` if it contains secrets — it's ignored by
// .gitignore in this project.

export const appConfigLocal = {
  // Example: Yandex Maps API key (set in Netlify via environment variables)
  yandexMapsApiKey: '',
  // Example local credentials used in development only
  authUsername: 'admin',
  authPassword: 'changeme'
};

export type AppConfigLocal = typeof appConfigLocal;
