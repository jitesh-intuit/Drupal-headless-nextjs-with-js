import { DrupalMenuLinkContent } from 'next-drupal';
import { drupal } from './drupal';
import { GetStaticPropsContext } from 'next';

export async function getMenus(context) {
  let options = {};
  if (context) {
    options = { defaultLocale: context.defaultLocale, locale: context.locale };
  }

  const { tree: mainMenu } = await drupal.getMenu('main', options);
  const { tree: footerMenu } = await drupal.getMenu('footer', options);

  return {
    main: mainMenu,
    footer: footerMenu,
  };
}
