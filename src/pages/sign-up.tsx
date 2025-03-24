import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { SignUpView } from 'src/sections/auth';
import { AuthRedirect } from 'src/guards/AuthRedirect';

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
