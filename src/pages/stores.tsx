import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StoresView } from 'src/sections/stores/index';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Stores - ${CONFIG.appName}`}</title>
      </Helmet>

      <StoresView />
    </>
  );
}
