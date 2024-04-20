import Image from 'next/image';
import Link from 'next/link';
const parse = require('html-react-parser');
const { domToReact, Element } = require('html-react-parser');
const { absoluteURL } = require('../lib/absolute-url');

const isRelative = require('../lib/is-relative');

const options = {
  replace: (domNode) => {
    if (domNode instanceof Element) {
      // Replace inline images with `Image` component.
      if (domNode.name === 'img') {
        const {
          src,
          alt,
          class: className,
          width = '100',
          height = '100',
        } = domNode.attribs;

        if (isRelative(src)) {
          return (
            <div className={className}>
              <Image
                src={absoluteURL(`/${src}`)}
                width={Number(width)}
                height={Number(height)}
                alt={alt}
                sizes="(min-width: 768px) 625px, 100vw"
              />
            </div>
          );
        }
      }

      // Replace inline links with `Link` component.
      if (domNode.name === 'a') {
        const { href, class: className } = domNode.attribs;

        if (href && isRelative(href)) {
          return (
            <Link href={href} className={className}>
              {domToReact(domNode.children)}
            </Link>
          );
        }
      }
    }
  },
};

function FormattedText({ processed }) {
  return <>{parse(processed, options)}</>;
}

module.exports = { FormattedText };
