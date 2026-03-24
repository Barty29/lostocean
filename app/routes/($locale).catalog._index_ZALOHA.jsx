import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {useLocale} from '~/hooks/useLocale';
import Breadcrumbs from '~/components/Breadcrumbs';

/**
 * @type {Route.MetaFunction}
 */

export const meta = ({params}) => {
  const language = params.locale || 'en';

  const title =
    language === 'sk' ? 'Produkty | Lost Ocean' : 'Products | Lost Ocean';

  return [{title}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 100,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {
        ...paginationVariables,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    }),
  ]);

  return {products};
}
// async function loadCriticalData({context, request}) {
//   const {storefront} = context;
//   const paginationVariables = getPaginationVariables(request, {
//     pageBy: 100,
//   });

//   const [{products}] = await Promise.all([
//     storefront.query(CATALOG_QUERY, {
//       variables: {...paginationVariables},
//     }),
//     // Add other queries here, so that they are loaded in parallel
//   ]);
//   return {products};
// }

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();
  const {t, language} = useLocale();

  // preč collection className
  return (
    <div className="layout-padding">
      <div className="product-list-header">
        <Breadcrumbs
          links={[
            {label: 'Home', labelSk: 'Domov', to: `/${language}`},
            {
              label: 'Catalog',
              labelSk: 'Katalóg',
              to: `${language}/catalog`,
            },
          ]}
        />
        <div>
          <h1>{t.catalog_heading}</h1>
          <p style={{marginTop: '8px'}}>{t.catalog_description}</p>
        </div>
        <div className="filter">
          <FilterBox label={t.filter_label_all} url="catalog" active={true} />
          <FilterBox label={t.filter_label_tshirts} url="t-shirts" />
          <FilterBox label={t.filter_label_hoodies} url="hoodies" />
          <FilterBox label={t.filter_label_accessories} url="accessories" />
        </div>
      </div>
      <hr className="divider" />
      <PaginatedResourceSection
        connection={products}
        resourcesClassName="products-grid"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 100 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

const FilterBox = ({label, active, url}) => {
  const {language} = useLocale();

  const fullUrl =
    url === 'catalog' ? `/${language}/catalog` : `/${language}/catalog/${url}`;

  const className = active ? 'filter-box--active' : 'filter-box';

  return (
    <Link to={fullUrl} className={className}>
      <h3>{label}</h3>
    </Link>
  );
};

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
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
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
