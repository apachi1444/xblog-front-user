import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <Iconify icon={name} width={24} height={24} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('mdi:view-dashboard'),
  },
  {
    title: 'Generate',
    path: '/generate',
    icon: icon('mdi:rocket-launch'),
  },
  /*
  {
    title: 'My Websites',
    path: '/stores',  
    icon: icon('mdi:web'),
    info: (
      <Label color="error" variant="inverted">
        +1
      </Label>
    ),
  },
  */
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
];
