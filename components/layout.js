import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { PreviewAlert } from 'components/preview-alert';
import { MenuMain } from 'components/menu--main';
import { MenuFooter } from 'components/menu--footer';

export function Layout({ title, menus, children }) {
  return (
    <>
      <Head>
        <title>{`${title} - Example`}</title>
      </Head>
      <PreviewAlert />
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex flex-col items-center justify-between px-6 py-4 mx-auto md:flex-row">
            <Link href="/" className="flex items-center mb-4 space-x-2 no-underline md:mb-0">
              <div className="w-8 h-10">
                <Image src="/logo.png" alt="Logo" width={76} height={90} />
              </div>
              <span className="text-lg font-semibold">Example</span>
            </Link>
            {menus && menus.main && <MenuMain menu={menus.main} />}
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="container px-6 mx-auto">
          <div className="pt-8 pb-12 border-t md:pt-12">
            {menus && menus.footer && <MenuFooter menu={menus.footer} />}
          </div>
        </footer>
      </div>
    </>
  );
}
