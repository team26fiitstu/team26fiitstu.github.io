// @ts-check
import { defineConfig } from 'astro/config';

// set by deploy workflow
export default defineConfig({
  site: process.env.SITE ?? 'http://localhost:4321',
  base: process.env.BASE ?? '/',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sk'],
    routing: { prefixDefaultLocale: false },
  },
});
