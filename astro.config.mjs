// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://murashfc-fan.com',
  integrations: [sitemap(), mdx()],
  // ページは今までどおり全て静的生成のまま。
  // MVP投票の API ルート（src/pages/api/*）だけが `export const prerender = false`
  // でサーバー関数になるため、アダプタだけ追加している。
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
