import { defineConfig } from 'astro/config';
import config from './site.config.mjs';

export default defineConfig({
  site: config.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
