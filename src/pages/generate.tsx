import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { GeneratingView } from 'src/components/form/GeneratingView';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Generate Article - ${CONFIG.appName}`}</title>
      </Helmet>

      <GeneratingView />
    </>
  );
}
