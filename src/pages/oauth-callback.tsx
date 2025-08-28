import { Helmet } from 'react-helmet-async';

import { OAuthCallbackView } from 'src/sections/oauth-callback';

// ----------------------------------------------------------------------

export default function OAuthCallbackPage() {
  return (
    <>
      <Helmet>
        <title>OAuth Callback - XBlog</title>
      </Helmet>

      <OAuthCallbackView />
    </>
  );
}
