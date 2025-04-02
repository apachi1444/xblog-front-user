import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AuthRedirect } from 'src/guards/AuthRedirect';

import { SignInView } from 'src/sections/auth';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Sign in - ${CONFIG.appName}`}</title>
      </Helmet>

      <AuthRedirect>
        <SignInView />
      </AuthRedirect>
    </>
  );
}
