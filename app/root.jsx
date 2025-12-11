// import {useEffect, useRef} from 'react';
import {LocaleProvider} from './hooks/useLocale';

import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  useRevalidator,
} from 'react-router';
import Logo from '~/assets/lost-ocean-logo.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import productStyles from '~/styles/product.css?url';
import faqStyles from '~/styles/faq.css?url';
import {PageLayout} from './components/PageLayout';
import {useLocation, Link} from 'react-router';
import ScrollToTop from './components/ScrollToTop';
/**
 * This is important to avoid re-fetching root queries on sub-navigations
 * @type {ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: Logo},
    {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
  ];
}

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

/**
 * @param {{children?: React.ReactNode}}
 */
export function Layout({children}) {
  const nonce = useNonce();

  return (
    <html lang="en" data-turbo="false">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <link rel="stylesheet" href={productStyles}></link>
        <link rel="stylesheet" href={faqStyles}></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData('root');
  const {pathname} = useLocation();

  // získa prefix /sk/... alebo /en/...
  const prefix = pathname.split('/')[1];
  const currentLang = ['sk', 'en'].includes(prefix) ? prefix : 'en';

  if (!data) {
    return (
      <LocaleProvider initialLanguage={currentLang}>
        <Outlet />
      </LocaleProvider>
    );
  }

  return (
    <LocaleProvider initialLanguage={currentLang}>
      <Analytics.Provider
        cart={data.cart}
        shop={data.shop}
        consent={data.consent}
      >
        <PageLayout {...data}>
          <ScrollToTop />
          <Outlet />
        </PageLayout>
      </Analytics.Provider>
    </LocaleProvider>
  );
}

// export default function App() {
//   /** @type {RootLoader} */
//   const data = useRouteLoaderData('root');

//   if (!data) {
//     return;
//     <LocaleProvider>
//       <Outlet />
//     </LocaleProvider>;
//   }

//   return (
//     <LocaleProvider>
//       <Analytics.Provider
//         cart={data.cart}
//         shop={data.shop}
//         consent={data.consent}
//       >
//         <PageLayout {...data}>
//           <Outlet />
//         </PageLayout>
//       </Analytics.Provider>
//     </LocaleProvider>
//   );
// }

const t = {
  sk: {
    notFound: 'Stránka sa nenašla',
    back: 'Späť na úvod',
  },
  en: {
    notFound: 'Page not found',
    back: 'Back to home',
  },
};

export function ErrorBoundary() {
  const error = useRouteError();

  const {pathname} = useLocation();
  const prefix = pathname.split('/')[1];
  const currentLang = ['sk', 'en'].includes(prefix) ? prefix : 'en';

  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;

    if (errorStatus === 404) {
      // Tu je tvoj vlastný HTML/JSX a štýl len pre 404
      return (
        <div className="error-page">
          <div className="error-bg" />
          <div className="error-content">
            <h1 style={{fontSize: '5rem', margin: 0, color: '#fff'}}>404</h1>
            <h2>{t[currentLang].notFound}</h2>
            <Link className="primary-button" to="/">
              {t[currentLang].back}
            </Link>
          </div>
        </div>
      );
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}

/** @typedef {LoaderReturnData} RootLoader */

/** @typedef {import('react-router').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('./+types/root').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
