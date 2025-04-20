import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TemplateView } from 'src/sections/templates/index';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Stores - ${CONFIG.appName}`}</title>
      </Helmet>

      <TemplateView />
    </>
  );
}