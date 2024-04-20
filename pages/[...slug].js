import * as React from 'react';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import { getMenus } from '../lib/get-menus';
import { Layout, LayoutProps } from '../components/layout';
import { NodeArticle } from '../components/node--article';
import { NodeEvent } from '../components/node--event';
import { NodePerson } from '../components/node--person';
import { NodePlace } from '../components/node--place';
import { NodeNews } from '../components/node--news';
import { NodeBasicPage } from '../components/node--page';
import { TaxonomyArticle } from '../components/taxonomy/taxonomy--article_type';
import { TaxonomyPerson } from '../components/taxonomy/taxonomy--person_type';
import { TaxonomyEvent } from '../components/taxonomy/taxonomy--event_type';
import { TaxonomyPlace } from '../components/taxonomy/taxonomy--place_type';
import { getPrioritizedStaticPathsFromContext } from '../lib/get-prioritized-static-paths';
import { Meta } from 'components/meta';
import { drupal } from '../lib/drupal';

export const ENTITY_TYPES = [
  'node--page',
  'node--article',
  'node--event',
  'node--person',
  'node--place',
  'node--news',
  'taxonomy_term--article_type',
  'taxonomy_term--event_type',
  'taxonomy_term--person_type',
  'taxonomy_term--place_type',
];

export default function EntityPage({
  entity,
  additionalContent,
  menus,
}) {
  return (
    <Layout title={entity.title || entity.name} menus={menus}>
      <Meta tags={entity.metatag} path={entity.path?.alias} />
      {entity.type === 'node--page' && (
        <NodeBasicPage node={entity} />
      )}
      {entity.type === 'node--article' && (
        <NodeArticle node={entity} />
      )}
      {entity.type === 'node--event' && (
        <NodeEvent node={entity} />
      )}
      {entity.type === 'node--person' && (
        <NodePerson node={entity} />
      )}
      {entity.type === 'node--place' && (
        <NodePlace node={entity} />
      )}
      {entity.type === 'node--news' && (
        <NodeNews node={entity} />
      )}
      {entity.type === 'taxonomy_term--article_type' && (
        <TaxonomyArticle
          additionalContent={additionalContent.nodes}
          taxonomy_term={entity}
        />
      )}
      {entity.type === 'taxonomy_term--person_type' && (
        <TaxonomyPerson
          additionalContent={additionalContent.nodes}
          taxonomy_term={entity}
        />
      )}
      {entity.type === 'taxonomy_term--event_type' && (
        <TaxonomyEvent
          additionalContent={additionalContent.nodes}
          taxonomy_term={entity}
        />
      )}
      {entity.type === 'taxonomy_term--place_type' && (
        <TaxonomyPlace
          additionalContent={additionalContent.nodes}
          taxonomy_term={entity}
        />
      )}
    </Layout>
  );
}

export async function getStaticPaths(context) {
  const limit = 200;
  const paths = await getPrioritizedStaticPathsFromContext(
    context,
    ENTITY_TYPES,
  );

  return {
    paths: paths.slice(0, limit),
    fallback: 'blocking',
  };
}

export async function getStaticProps(context) {
  const path = await drupal.translatePathFromContext(context);

  if (!path) {
    return {
      notFound: true,
    };
  }

  if (path.redirect) {
    const [redirect] = path.redirect;
    return {
      redirect: {
        destination: redirect.to,
        permanent: redirect.status === '301',
      },
    };
  }

  const type = path.jsonapi.resourceName;

  if (!ENTITY_TYPES.includes(type)) {
    return {
      notFound: true,
    };
  }

  const additionalContent = {};
  const params = new DrupalJsonApiParams();

  if (type === 'node--page') {
    params.addInclude(['field_page_image.image']);
  }
  if (type === 'node--news') {
    params.addInclude(['field_image.image']);
  }

  // other conditions to add includes and filters...

  const entity = await drupal.getResourceFromContext(
    type,
    context,
    {
      params: params.getQueryObject(),
    },
  );

  if (!entity) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
  }

  if (!context.preview && entity?.status === false) {
    return {
      notFound: true,
    };
  }

  // Fetch additional content for rendering taxonomy term pages.
  // conditions to fetch additional content...

  return {
    props: {
      entity: entity,
      additionalContent: additionalContent,
      menus: await getMenus(context),
    },
    revalidate: 60,
  };
}
