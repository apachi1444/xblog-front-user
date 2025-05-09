import { Helmet } from 'react-helmet-async';

import { ArticlePreviewDemo } from 'src/components/article-preview/ArticlePreviewDemo';
import { DashboardContent } from 'src/layouts/dashboard';

export default function ArticlePreviewDemoPage() {
  return (
    <>
      <Helmet>
        <title>Article Preview Demo | XBlog</title>
      </Helmet>

      <DashboardContent>
        <ArticlePreviewDemo />
      </DashboardContent>
    </>
  );
}
