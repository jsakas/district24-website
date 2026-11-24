// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Static site generation (SSG): every page in src/pages is rendered to its own
// HTML file at build time. React is only shipped to the browser for the
// interactive "islands" marked with a client:* directive.
export default defineConfig({
  site: 'https://www.aadistrict24.org',
  output: 'static',
  outDir: './build',
  integrations: [react()],
});
