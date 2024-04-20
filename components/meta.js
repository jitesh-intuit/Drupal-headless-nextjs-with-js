import Head from 'next/head';
import { unstable_getImgProps } from 'next/image';

export function Meta({ path, tags }) {
  const baseUrl = absoluteSiteUrl();
  const absoluteUrl = `${baseUrl}${path !== '/' ? path : ''}`.split('?')[0];
  const schemaMetatag = {};
  const schemaMetatagData = {};
  if (Array.isArray(tags)) {
    tags = tags
      .map((tag) => {
        if (tag.attributes.property === 'og:url') {
          tag.attributes.content = absoluteUrl;
        }
        if (tag.attributes.name === 'keywords') {
          tag.attributes.content = tag.attributes.content.replace(/,\s*$/, '');
        }

        if (tag.attributes.schema_metatag) {
          schemaMetatag[tag.attributes.name] =
            tag.attributes.name === 'image'
              ? imageAbsoluteUrl(tag.attributes.content.url)
              : tag.attributes.content;
        }

        if (
          tag.attributes.rel === 'canonical' ||
          tag.attributes.schema_metatag ||
          tag.attributes.content.length == 0
        ) {
          return null;
        }

        return tag;
      })
      .filter((tag) => tag !== null);

    schemaMetatagData['@context'] = 'https://schema.org';
    schemaMetatagData['@graph'] = [schemaMetatag];
  }

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(schemaMetatagData, null, 2)}
      </script>
      <link rel="canonical" href={absoluteUrl} />
      {tags?.length ? (
        tags.map((tag, index) => {
          if (tag.attributes.name === 'title') {
            return <title key={index}>{tag.attributes.content}</title>;
          }
          if (tag.attributes.property === 'og:image') {
            return (
              <meta
                key={index}
                property={tag.attributes.property}
                content={imageAbsoluteUrl(tag.attributes.content)}
              />
            );
          }
          if (tag.attributes.name === 'twitter:image') {
            return (
              <meta
                key={index}
                name={tag.attributes.name}
                content={imageAbsoluteUrl(tag.attributes.content)}
              />
            );
          }

          const Tag = tag.tag;
          return <Tag key={index} {...tag.attributes}></Tag>;
        })
      ) : (
        <></>
      )}
    </Head>
  );
}

export function imageAbsoluteUrl(content) {
  const imageProps = unstable_getImgProps({
    src: content,
    alt: '',
    quality: 75,
    width: 1200,
    height: 630,
  });

  let absoluteUrl = imageProps.props.src;
  if (absoluteUrl.startsWith('/')) {
    absoluteUrl = absoluteSiteUrl() + absoluteUrl;
  }

  return absoluteUrl;
}

export function absoluteSiteUrl() {
  const clientSideUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL;

  return siteBaseUrl ? siteBaseUrl : clientSideUrl;
}
