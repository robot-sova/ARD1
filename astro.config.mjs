import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://friendly-squirrel-dc0a02.netlify.app',
  integrations: [tailwind(), react(), sitemap()]
});