import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EditSectionView } from 'src/sections/generate/edit-section/edit-section-view';



// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Edit Article Section- ${CONFIG.appName}`}</title>
      </Helmet>

      <EditSectionView />
    </>
  );
}
