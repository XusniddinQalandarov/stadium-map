export interface AppConfig {
  yandexMapsApiKey: string;
  authUsername: string;
  authPassword: string;
}

// IMPORTANT: Never commit real credentials to Git!
// This file contains placeholder values that are safe to commit

// For development, import from app.config.local.ts (not tracked by Git)
// For production, use environment variables or build-time replacement
export const appConfig: AppConfig = {
  yandexMapsApiKey: 'YOUR_YANDEX_API_KEY_HERE',
  authUsername: 'YOUR_USERNAME_HERE',
  authPassword: 'YOUR_PASSWORD_HERE'
};
