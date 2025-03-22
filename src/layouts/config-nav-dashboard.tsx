import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Generate',
    path: '/generate',
    icon: icon('ic-user'),
  },
  {
    title: 'Generate Fake',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Blogs',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Calendar',
    path: '/calendar',
    icon: icon('ic-user'),
  },
  {
    title: 'My Websites',
    path: '/stores',  
    icon: icon('ic-cart'),
    /*
    info: (
      <Label color="error" variant="inverted">
        +1
      </Label>
    ),
    */
  },
];

export const bottomNavData = [
  {
    title: 'Upgrade your license',
    path: '/upgrade-license',
    icon: icon('ic-blog'),
  },
  {
    title: 'Book Demo',
    path: '/book-demo',
    icon: icon('ic-blog'),
  },
];
