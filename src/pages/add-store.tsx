import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import AddStoreFlow from 'src/sections/add-store/view';



// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Add Store - ${CONFIG.appName}`}</title>
      </Helmet>

      <AddStoreFlow />
    </>
  );
}
