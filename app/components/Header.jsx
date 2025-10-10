import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

import Logo from '../assets/lost-ocean-logo.svg';
import LogoText from '../assets/lost-ocean-logo-text.svg';
import Hamburger from '../assets/hamburger.svg';
import Bag from '../assets/bag.svg';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {open} = useAside();
  const {shop, menu} = header;

  return (
    <header className="header">
      <NavLink prefetch="intent" to="/" end>
        <img src={Logo} alt="logo" />
      </NavLink>
      {/* TODO center */}
      <NavLink prefetch="intent" to="/" end className="header-logo-text">
        <img src={LogoText} alt="logo-text" />
      </NavLink>

      {/* TODO MENU BOČNÉ */}
      {/* <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      /> */}
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
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav
      className=""
      role="navigation"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100% - 149px)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <NavLink
          className="header-menu-item"
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>

        <NavLink
          className="header-menu-item"
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="/collections/all"
        >
          Products
        </NavLink>

        <NavLink
          className="header-menu-item"
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="/cart"
        >
          Cart
        </NavLink>

        <BoneDivider />

        {/* <NavLink
        className="header-menu-item"
        end
        onClick={close}
        prefetch="intent"
        // style={activeLinkStyle}
        to="/collections"
      >
        Collections
      </NavLink> */}

        <NavLink
          className="header-menu-item"
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="/pages/about-us"
        >
          About us
        </NavLink>

        <NavLink
          className="header-menu-item"
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="/blogs"
        >
          Blog
        </NavLink>

        <NavLink
          className="header-menu-item"
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="/blogs"
        >
          FAQ
        </NavLink>

        <NavLink
          className="header-menu-item"
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="/blogs"
        >
          Contact
        </NavLink>

        <BoneDivider />

        <NavLink
          className="header-menu-item"
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="/policies/privacy-policy"
        >
          Privacy policy
        </NavLink>

        <BoneDivider />
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
          to="/policies/privacy-policy"
        >
          Instagram
        </NavLink>

        <NavLink
          className="header-menu-item"
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="/policies/privacy-policy"
        >
          Facebook
        </NavLink>
      </div>
    </nav>
  );
}

const BoneDivider = () => {
  return (
    <hr
      style={{
        border: 'none',
        height: '1px',
        backgroundColor: '#4d433b',
        margin: '8px 0px',
      }}
    />
    // <div class="bone-divider">
    //   <span class="bone-side left"></span>
    //   <span class="bone-middle"></span>
    //   <span class="bone-side right"></span>
    // </div>
  );
};

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */

// EDIT
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
  const {open} = useAside();
  return (
    <button
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
      onClick={() => open('mobile')}
    >
      <img src={Hamburger} alt="hamburger-icon" />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            WebkitBoxPack: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            WebkitBoxAlign: 'center',
            alignItems: 'center',
            position: 'absolute',
            boxSizing: 'border-box',
            fontWeight: 500,
            minWidth: '20px',
            lineHeight: 1,
            height: '20px',
            zIndex: 1,
            backgroundColor: '#4D433B',
            color: '#F9F9F9',
            top: '0px',
            right: '0px',
            transform: 'scale(1) translate(50%, -50%)',
            transformOrigin: '100% 0%',
            padding: '0px 6px',
            borderRadius: '10px',
            transition: 'transform 225ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {count}
        </div>
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

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

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
