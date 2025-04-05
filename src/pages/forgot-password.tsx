import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AuthRedirect } from 'src/guards/AuthRedirect';

import { ForgotPasswordView } from 'src/sections/auth';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Forgot Password - ${CONFIG.appName}`}</title>
      </Helmet>

      <AuthRedirect>
        <ForgotPasswordView />
      </AuthRedirect>
    </>
  );
}