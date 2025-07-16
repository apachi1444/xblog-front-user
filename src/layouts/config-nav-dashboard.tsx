import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <Iconify icon={name} width={22} height={22} />
);

// Primary CTA button (like Koyeb's "Create Service")
export const primaryCTA = {
  title: 'Generate',
  path: '/create',
  icon: icon('mdi:rocket-launch'),
};

// Main navigation items (excluding the primary CTA)
export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('mdi:view-dashboard'),
  },
  {
    title: 'Blogs',
    path: '/blog',
    icon: icon('mdi:blog'),
  },
  {
    title: 'Calendar',
    path: '/calendar',
    icon: icon('mdi:calendar'),
  },
  {
    title: 'Templates',
    path: '/templates',
    icon: icon('material-symbols:temple-buddhist-outline-sharp'),
  },
  {
    title: 'Article Preview',
    path: '/article-preview-demo',
    icon: icon('mdi:eye'),
  },
];

export const bottomNavData = [
  {
    title: 'Upgrade license',
    path: '/upgrade-license',
    icon: icon('mdi:license'),
  },
  {
    title: 'Book Demo',
    path: '/book-demo',
    icon: icon('mdi:book-open'),
  },
  {
    title: 'AI Assistance chat',
    path: '/ai-chat',
    icon: icon('mdi:robot-outline'),
  },
];
