import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OnboardingSuccessView } from 'src/sections/onboarding/view/onboarding-success-view';

// ----------------------------------------------------------------------

export default function OnboardingSuccessPage() {
  return (
    <>
      <Helmet>
        <title> {`Payment Success - ${CONFIG.appName}`}</title>
      </Helmet>

      <OnboardingSuccessView />
    </>
  );
}
