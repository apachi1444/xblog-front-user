import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OnBoardingView } from 'src/sections/onboarding/view';



// ----------------------------------------------------------------------

export default function OnboardingPage() {
  return (
    <>
      <Helmet>
        <title> {`OnBoarding Content - ${CONFIG.appName}`}</title>
      </Helmet>

      <OnBoardingView />
    </>
  );
}