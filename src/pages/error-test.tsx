import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { TestErrorComponent } from 'src/components/error-boundary';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Error Boundary Test - ${CONFIG.appName}`}</title>
      </Helmet>

      <TestErrorComponent />
    </>
  );
}
