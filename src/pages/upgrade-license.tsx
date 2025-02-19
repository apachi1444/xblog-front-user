import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UpgradeLicenseView } from 'src/sections/upgrade-license/upgrade-license-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Upgrade License - ${CONFIG.appName}`}</title>
      </Helmet>

      <UpgradeLicenseView />
    </>
  );
}
