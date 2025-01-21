import 'i18next';
import { resources } from './libs/i18n'; // Import your actual resources

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['en']; // Use your English resource type as the base
  }
}