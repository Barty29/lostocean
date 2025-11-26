import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue, useLocation} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {useLocale} from '~/hooks/useLocale';

import Logo from '../assets/lost-ocean-logo.svg';
import LogoText from '../assets/lost-ocean-logo-text.svg';
import HamburgerIcon from '../assets/hamburger.svg';
import CloseIcon from '../assets/close-icon.svg';
import Bag from '../assets/bag.svg';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {open} = useAside();
  const {language} = useLocale();
  const {pathname} = useLocation();

  const {shop, menu} = header;

  const isHome =
    pathname === '/' ||
    pathname === '/sk' ||
    pathname === '/sk/' ||
    pathname === '/en' ||
    pathname === '/en/';

  return (
    <header className={isHome ? 'header header-home' : 'header header-page'}>
      <NavLink prefetch="intent" to={`/${language}`} end>
        <img src={Logo} alt="logo" className="logo-desktop" />
        <img src={Logo} alt="logo" width="90px" className="logo-mobile" />
      </NavLink>
      <NavLink
        prefetch="intent"
        to={`/${language}`}
        end
        className="header-logo-text"
      >
        <img src={LogoText} alt="logo-text" />
      </NavLink>
      <div>
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */

const navLinks = [
  {id: '01', url: '', labelEN: 'Home', labelSK: 'Domov'},
  {id: '02', url: 'catalog', labelEN: 'Catalog', labelSK: 'Katalóg'},
  {id: '03', url: 'cart', labelEN: 'Cart', labelSK: 'Košík'},
  {id: 'hr1', type: 'hr'},
  {id: '04', url: 'about-us', labelEN: 'About us', labelSK: 'O nás'},
  // {id: '05', url: 'blogs', labelEN: 'Blog', labelSK: 'Blog'},
  {id: '06', url: 'faq', labelEN: "FAQ's", labelSK: 'FAQ'},
  {id: '07', url: 'contact', labelEN: 'Contact', labelSK: 'Kontakt'},
  {id: 'hr2', type: 'hr'},
  {
    id: '08',
    url: 'policies/privacy-policy',
    labelEN: 'Privacy Policy',
    labelSK: 'Ochrana osobných údajov',
  },
];
export function HeaderMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  const {close} = useAside();
  const {t, language} = useLocale();

  return (
    <nav className="header-aside-menu" role="navigation">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {navLinks.map((item) => {
          const label = language === 'sk' ? item.labelSK : item.labelEN;
          const urlPrefix = language === 'sk' ? 'sk' : 'en';

          return item.type === 'hr' ? (
            <hr key={item.id} className="divider-primary" />
          ) : (
            <NavLink
              key={item.id}
              className="header-menu-item"
              end
              onClick={close}
              prefetch="intent"
              to={`/${urlPrefix}/${item.url}`}
            >
              {label}
            </NavLink>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          // flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <NavLink
          className="header-menu-item"
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="https://www.instagram.com/lostoceanclth/"
        >
          Instagram
        </NavLink>

        <NavLink
          className="header-menu-item"
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="https://www.instagram.com/lostoceanclth/"
        >
          Facebook
        </NavLink>
      </div>
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */

function HeaderCtas({isLoggedIn, cart}) {
  const {open} = useAside();
  return (
    <nav className="header-ctas" role="navigation">
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open, close, type} = useAside();

  const iconSrc = type === 'closed' ? HamburgerIcon : CloseIcon;

  return (
    <button
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
      onClick={type === 'closed' ? () => open('mobile') : close}
    >
      <img src={iconSrc} alt="hamburger-icon" width="38px" />
    </button>
  );
}

// function SearchToggle() {
//   const {open} = useAside();
//   return (
//     <button className="reset" onClick={() => open('search')}>
//       Search
//     </button>
//   );
// }

/**
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
      style={{
        position: 'relative',
        display: 'inline-flex',
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
    >
      <img src={Bag} alt="bag-icon" />
      {count === null ? (
        <span>&nbsp;</span>
      ) : (
        <div className="badge">{count}</div>
      )}
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

// const FALLBACK_HEADER_MENU = {
//   id: 'gid://shopify/Menu/199655587896',
//   items: [
//     {
//       id: 'gid://shopify/MenuItem/461609500728',
//       resourceId: null,
//       tags: [],
//       title: 'Collections',
//       type: 'HTTP',
//       url: '/collections',
//       items: [],
//     },
//     {
//       id: 'gid://shopify/MenuItem/461609533496',
//       resourceId: null,
//       tags: [],
//       title: 'Blog',
//       type: 'HTTP',
//       url: '/blogs/journal',
//       items: [],
//     },
//     {
//       id: 'gid://shopify/MenuItem/461609566264',
//       resourceId: null,
//       tags: [],
//       title: 'Policies',
//       type: 'HTTP',
//       url: '/policies',
//       items: [],
//     },
//     {
//       id: 'gid://shopify/MenuItem/461609599032',
//       resourceId: 'gid://shopify/Page/92591030328',
//       tags: [],
//       title: 'About',
//       type: 'PAGE',
//       url: '/pages/about',
//       items: [],
//     },
//   ],
// };

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    // color: isActive ? '#4d433b' : '#f9f9f9',
    // color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
