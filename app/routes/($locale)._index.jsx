import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';

// import {translations} from '~/lib/i18n';
import {useLocale} from '~/hooks/useLocale';
import SimpleFooter from '~/components/SimpleFooter';
import InstagramFeed from '~/components/InstagramFeed';
import TopProducts from '~/components/TopProducts';
import NewProducts from '~/components/NewProducts';
import AboutBrand from '~/components/AboutBrand';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Lost Ocean'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront} = args.context;
  const locale = storefront.i18n;

  return {...deferredData, ...criticalData, locale};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const {storefront} = context;
  const i18n = storefront.i18n; // 👈 získame aktuálny jazyk a krajinu

  const [{collections}] = await Promise.all([
    storefront.query(FEATURED_COLLECTION_QUERY, {
      variables: {
        country: i18n.country, // 👈 pridaj krajinu (napr. SK)
        language: i18n.language, // 👈 pridaj jazyk (napr. SK)
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}
// async function loadCriticalData({context}) {
//   const [{collections}] = await Promise.all([
//     context.storefront.query(FEATURED_COLLECTION_QUERY),
//     // Add other queries here, so that they are loaded in parallel
//   ]);

//   return {
//     featuredCollection: collections.nodes[0],
//   };
// }

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const {storefront} = context;
  const i18n = storefront.i18n; // 👈 získame aktuálne locale (jazyk + krajina)

  const recommendedProducts = storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {
        country: i18n.country,
        language: i18n.language,
      },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  const topProducts = storefront
    .query(TOP_SELLING_PRODUCTS_QUERY, {
      variables: {
        country: i18n.country,
        language: i18n.language,
      },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
    topProducts,
  };
}
// function loadDeferredData({context}) {
//   const recommendedProducts = context.storefront
//     .query(RECOMMENDED_PRODUCTS_QUERY)
//     .catch((error) => {
//       // Log query errors, but don't throw them so the page can still render
//       console.error(error);
//       return null;
//     });

//   return {
//     recommendedProducts,
//   };
// }

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  const {t, language} = useLocale();

  return (
    <div>
      <div className="home-page-layout home-page layout-padding-home">
        <div className="home-content-box">
          <h1
            style={{fontSize: '56px', textTransform: 'none'}}
            className="np__title"
          >
            {t.home_heading}
          </h1>
          <p style={{marginTop: '8px', color: 'rgb(191, 191, 191)'}}>
            {t.home_text}
          </p>
          <div className="home-links-container">
            <Link
              to={`/${language}/catalog`}
              className="primary-button hp-link"
            >
              {t.shop_now}
            </Link>
            <Link
              to={`/${language}/about-us`}
              className="primary-button hp-link"
            >
              {t.about_us}
            </Link>
          </div>
        </div>
        <div className="vertical-links">
          <Link
            prefetch="intent"
            to={`/${language}/catalog`}
            className="primary-button hp-link"
          >
            {t.shop_now}
          </Link>
          <Link
            prefetch="intent"
            to={`/${language}/about-us`}
            className="primary-button hp-link"
          >
            {t.about_us}
          </Link>
        </div>
        {/* <div className="home-button">
          <Link
            className="primary-button"
            prefetch="intent"
            to={`/${language}/catalog`}
            style={{fontSize: '32px'}}
          >
            {t.shop_now}
          </Link>
        </div> */}
        {/* <SimpleFooter /> */}
      </div>
      <div className="layout-padding-home">
        <div className="hp-content-layout">
          <NewProducts products={data.recommendedProducts} />
          <TopProducts products={data.topProducts} />
          <AboutBrand />
          <InstagramFeed />
        </div>
      </div>

      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */

// function RecommendedProducts({products}) {
//   return (
//     <div className="recommended-products">
//       <h2>Recommended Products</h2>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Await resolve={products}>
//           {(response) => (
//             <div className="recommended-products-grid">
//               {response
//                 ? response.products.nodes.map((product) => (
//                     <ProductItem key={product.id} product={product} />
//                   ))
//                 : null}
//             </div>
//           )}
//         </Await>
//       </Suspense>
//       <br />
//     </div>
//   );
// }

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const TOP_SELLING_PRODUCTS_QUERY = `#graphql
  fragment TopProduct on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    collections(first: 5) {
      nodes {
        handle
      }
    }
  }
  query BestSellersCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "best_sellers") {
      products(first: 4) {
        nodes {
          ...TopProduct
        }
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
