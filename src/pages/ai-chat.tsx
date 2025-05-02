import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AIChatView } from 'src/sections/ai-chat/ai-chat-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`AI Assistance Chat - ${CONFIG.appName}`}</title>
      </Helmet>

      <AIChatView />
    </>
  );
}
