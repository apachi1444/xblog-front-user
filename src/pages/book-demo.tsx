import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BookDemoView } from 'src/sections/book-demo/book-demo-view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Book Demo - ${CONFIG.appName}`}</title>
      </Helmet>

      <BookDemoView />
    </>
  );
}
