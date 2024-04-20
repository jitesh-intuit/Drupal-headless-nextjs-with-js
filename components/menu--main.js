import { useRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';

export function MenuMain({ menu, ...props }) {
  const router = useRouter();

  if (!menu || !menu.length) {
    return null;
  }

  return (
    <nav data-cy="nav-menu" {...props}>
      <ul className="flex items-center space-x-4 md:space-x-8">
        {menu.map((item) => {
          const isActive =
            router.asPath === item.url ||
            (item.url !== '/' ? router.asPath.indexOf(item.url) === 0 : false);

          return (
            <li
              key={item.id}
              className={classNames('menu-item', {
                'menu-item--active-trail': isActive,
              })}
            >
              <Link
                href={item.url}
                className={classNames('hover:text-blue-600', {
                  'text-blue-600': isActive,
                })}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
