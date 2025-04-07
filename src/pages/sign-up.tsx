import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AuthRedirect } from 'src/guards/AuthRedirect';

import { SignUpView } from 'src/sections/auth';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Sign up - ${CONFIG.appName}`}</title>
      </Helmet>

      <AuthRedirect>
        <SignUpView />
      </AuthRedirect>
    </>
  );
}
