import { getMenus } from 'lib/get-menus';
import { Layout } from 'components/layout';
import { PageHeader } from 'components/page-header';
import { NodeArticleTeaser } from 'components/node--article';
import { drupal } from '../lib/drupal';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

export default function ArticlePage({ menus, articles }) {
  return (
    <Layout title="Articles" menus={menus}>
      <PageHeader heading="Articles" text="List of latest articles." />
      <div className="container px-6 pb-10 mx-auto">
        {articles?.length ? (
          <div className="grid gap-14 md:grid-cols-2">
            {articles.map((article) => (
              <NodeArticleTeaser key={article.id} node={article} />
            ))}
          </div>
        ) : (
          <p>No content found.</p>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps(context) {
  const articles = await drupal.getResourceCollectionFromContext(
    'node--article',
    context,
    {
      params: new DrupalJsonApiParams()
        .addFilter('status', '1')
        .addSort('created', 'DESC')
        .addInclude(['field_article_image.image', 'field_display_author'])
        .addFields('node--article', [
          'id',
          'title',
          'body',
          'path',
          'created',
          'field_display_author',
          'field_article_image',
        ])
        .getQueryObject(),
    },
  );

  return {
    props: {
      articles,
      menus: await getMenus(context),
    },
    revalidate: 60,
  };
}
