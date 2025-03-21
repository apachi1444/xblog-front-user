// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/';

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),
    register: path(ROOTS_AUTH, '/register'),
    loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
    registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
    verify: path(ROOTS_AUTH, '/verify'),
    resetPassword: path(ROOTS_AUTH, '/reset-password'),
    newPassword: path(ROOTS_AUTH, '/new-password'),
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS_DASHBOARD,
    general: {
      app: path(ROOTS_DASHBOARD, 'app'),
      ecommerce: path(ROOTS_DASHBOARD, 'ecommerce'),
      analytics: path(ROOTS_DASHBOARD, 'analytics'),
      banking: path(ROOTS_DASHBOARD, 'banking'),
      booking: path(ROOTS_DASHBOARD, 'booking'),
      file: path(ROOTS_DASHBOARD, 'file'),
    },
    user: {
      root: path(ROOTS_DASHBOARD, 'user'),
      new: path(ROOTS_DASHBOARD, 'user/new'),
      list: path(ROOTS_DASHBOARD, 'user/list'),
      cards: path(ROOTS_DASHBOARD, 'user/cards'),
      profile: path(ROOTS_DASHBOARD, 'user/profile'),
      account: path(ROOTS_DASHBOARD, 'user/account'),
      edit: (id: string) => path(ROOTS_DASHBOARD, `user/${id}/edit`),
      demo: {
        edit: path(ROOTS_DASHBOARD, `user/reece-chung/edit`),
      },
    },
    product: {
      root: path(ROOTS_DASHBOARD, 'product'),
      new: path(ROOTS_DASHBOARD, 'product/new'),
      details: (id: string) => path(ROOTS_DASHBOARD, `product/${id}`),
      edit: (id: string) => path(ROOTS_DASHBOARD, `product/${id}/edit`),
      demo: {
        details: path(ROOTS_DASHBOARD, 'product/nike-air-force-1-ndestrukt'),
        edit: path(ROOTS_DASHBOARD, 'product/nike-air-force-1-ndestrukt/edit'),
      },
    },
    invoice: {
      root: path(ROOTS_DASHBOARD, 'invoice'),
      new: path(ROOTS_DASHBOARD, 'invoice/new'),
      details: (id: string) => path(ROOTS_DASHBOARD, `invoice/${id}`),
      edit: (id: string) => path(ROOTS_DASHBOARD, `invoice/${id}/edit`),
      demo: {
        details: path(ROOTS_DASHBOARD, 'invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1'),
        edit: path(ROOTS_DASHBOARD, 'invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
      },
    },
    blog: {
      root: path(ROOTS_DASHBOARD, 'blog'),
      new: path(ROOTS_DASHBOARD, 'blog/new'),
      details: (title: string) => path(ROOTS_DASHBOARD, `blog/${title}`),
      edit: (title: string) => path(ROOTS_DASHBOARD, `blog/${title}/edit`),
      demo: {
        details: path(ROOTS_DASHBOARD, 'blog/apply-these-7-secret-techniques-to-improve-event'),
        edit: path(ROOTS_DASHBOARD, 'blog/apply-these-7-secret-techniques-to-improve-event/edit'),
      },
    },
    stores: path(ROOTS_DASHBOARD, 'stores'),
    addStore: path(ROOTS_DASHBOARD, 'stores/add'),
    calendar: path(ROOTS_DASHBOARD, 'calendar'),
  },
}; 