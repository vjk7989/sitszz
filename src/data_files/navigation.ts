/**
 * English navigation structure: stable ids, site-relative paths and social
 * URLs. Labels live in the shared copy table so paths stay separate from UI
 * text.
 */
export type NavLinkId = 'home' | 'products' | 'services' | 'blog';

export const navLinks: { id: NavLinkId; path: string }[] = [
  { id: 'home', path: '/' },
  { id: 'products', path: '/products' },
  { id: 'services', path: '/services' },
  { id: 'blog', path: '/blog' },
];

export type FooterSectionId = 'ecosystem' | 'company';
export type FooterLinkId =
  | 'documentation'
  | 'tools'
  | 'services'
  | 'about'
  | 'blog'
  | 'careers'
  | 'customers';

export const footerSections: {
  id: FooterSectionId;
  links: { id: FooterLinkId; path: string; badge?: 'hiring' }[];
}[] = [
  {
    id: 'ecosystem',
    links: [
      { id: 'documentation', path: '/welcome-to-docs/' },
      { id: 'tools', path: '/products' },
      { id: 'services', path: '/services' },
    ],
  },
  {
    id: 'company',
    links: [
      { id: 'about', path: '#' },
      { id: 'blog', path: '/blog' },
      { id: 'careers', path: '#', badge: 'hiring' },
      { id: 'customers', path: '#' },
    ],
  },
];

export const socialLinks = {
  facebook: 'https://www.facebook.com/',
  x: 'https://twitter.com/',
  github: 'https://github.com/mearashadowfax/ScrewFast',
  google: 'https://www.google.com/',
  slack: 'https://slack.com/',
};
