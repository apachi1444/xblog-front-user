import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CreateView } from 'src/sections/create/view';


// ----------------------------------------------------------------------

export default function CreatePage() {
  return (
    <>
      <Helmet>
        <title> {`Create Content - ${CONFIG.appName}`}</title>
      </Helmet>

      <CreateView />
    </>
  );
}