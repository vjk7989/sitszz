import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

import mdx from '@astrojs/mdx';

const siteOrigin = process.env.SITE_URL ?? 'https://vjk7989.github.io';
const basePath = process.env.BASE_PATH ?? '/sitszz';
const publicBase = `${siteOrigin}${basePath === '/' ? '' : basePath}`;

// https://astro.build/config
export default defineConfig({
  // https://docs.astro.build/en/guides/images/#authorizing-remote-images
  site: siteOrigin,
  base: basePath,
  image: {
    domains: ['images.unsplash.com'],
  },
  // i18n: {
  //   defaultLocale: "en",
  //   locales: ["en", "fr"],
  //   fallback: {
  //     fr: "en",
  //   },
  //   routing: {
  //     prefixDefaultLocale: false,
  //   },
  // },
  prefetch: true,
  integrations: [
    sitemap(),
    starlight({
      title: 'ScrewFast Docs',
      // https://starlight.astro.build/guides/sidebar/
      sidebar: [
        {
          label: 'Quick Start Guides',
          items: [{ autogenerate: { directory: 'guides' } }],
        },
        {
          label: 'Tools & Equipment',
          items: [
            { label: 'Tool Guides', link: 'tools/tool-guides/' },
            { label: 'Equipment Care', link: 'tools/equipment-care/' },
          ],
        },
        {
          label: 'Construction Services',
          translations: {
            de: 'Baudienstleistungen',
            es: 'Servicios de Construcción',
            fa: 'خدمات ساخت‌وساز',
            fr: 'Services de Construction',
            ja: '建設サービス',
            'zh-cn': '施工服务',
          },
          items: [{ autogenerate: { directory: 'construction' } }],
        },
        {
          label: 'Advanced Topics',
          items: [{ autogenerate: { directory: 'advanced' } }],
        },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/mearashadowfax/ScrewFast',
        },
      ],
      disable404Route: true,
      customCss: ['./src/assets/styles/starlight.css'],
      favicon: `${basePath === '/' ? '' : basePath}/favicon.ico`,
      components: {
        SiteTitle: './src/components/ui/starlight/SiteTitle.astro',
        Head: './src/components/ui/starlight/Head.astro',
        MobileMenuFooter:
          './src/components/ui/starlight/MobileMenuFooter.astro',
        ThemeSelect: './src/components/ui/starlight/ThemeSelect.astro',
      },
      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: publicBase + '/social.webp',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'twitter:image',
            content: publicBase + '/social.webp',
          },
        },
      ],
    }),
    mdx(),
  ],
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
