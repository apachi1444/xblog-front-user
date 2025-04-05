import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-home'),
  },
  {
    title: 'Generate',
    path: '/generate',
    icon: icon('ic-generate'),
  },
  /*
  {
    title: 'My Websites',
    path: '/stores',  
    icon: icon('ic-cart'),
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
    icon: icon('ic-blogs'),
  },
  {
    title: 'Calendar',
    path: '/calendar',
    icon: icon('ic-calendar'),
  },
];

export const bottomNavData = [
  {
    title: 'Upgrade license',
    path: '/upgrade-license',
    icon: icon('ic-upgrade'),
  },
  {
    title: 'Book Demo',
    path: '/book-demo',
    icon: icon('ic-book-demo'),
  },
];
