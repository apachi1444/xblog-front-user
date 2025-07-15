import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MockPaymentView } from 'src/sections/onboarding/view/mock-payment-view';

// ----------------------------------------------------------------------

export default function MockPaymentPage() {
  return (
    <>
      <Helmet>
        <title> {`Mock Payment - ${CONFIG.appName}`}</title>
      </Helmet>

      <MockPaymentView />
    </>
  );
}
