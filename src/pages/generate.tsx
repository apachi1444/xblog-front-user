import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { GenerateView } from 'src/sections/generate/view'

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Generate Article - ${CONFIG.appName}`}</title>
      </Helmet>

      <GenerateView />
    </>
  );
}
