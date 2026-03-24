import {Suspense} from 'react';
import {Await, useLoaderData, Link} from 'react-router';
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
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Tu nechávame len veci, ktoré majú byť hneď.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData() {
  return {};
}

/**
 * Produkty načítame deferred, aby sa mohol zobraziť skeleton.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const {storefront} = context;

  const collections = storefront
    .query(CATALOG_COLLECTIONS_QUERY, {
      variables: {
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    })
    .then(({collections}) => {
      const desiredOrder = ['t-shirts', 'hoodies', 'accessories'];

      const sortedCollections = collections.nodes
        .filter((collection) => desiredOrder.includes(collection.handle))
        .sort(
          (a, b) =>
            desiredOrder.indexOf(a.handle) - desiredOrder.indexOf(b.handle),
        );

      return sortedCollections;
    });

  return {collections};
}

// function loadDeferredData({context}) {
//   const {storefront} = context;

//   const collections = storefront
//     .query(CATALOG_COLLECTIONS_QUERY, {
//       variables: {
//         country: storefront.i18n.country,
//         language: storefront.i18n.language,
//       },
//     })
//     .then(async ({collections}) => {
//       // 2 sekundový delay aby bol viditeľný skeleton
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       const desiredOrder = ['t-shirts', 'hoodies', 'accessories'];

//       const sortedCollections = collections.nodes
//         .filter((collection) => desiredOrder.includes(collection.handle))
//         .sort(
//           (a, b) =>
//             desiredOrder.indexOf(a.handle) - desiredOrder.indexOf(b.handle),
//         );

//       return sortedCollections;
//     });

//   return {collections};
// }

export default function Collection() {
  const {collections} = useLoaderData();
  const {t, language} = useLocale();

  return (
    <div className="layout-padding">
      <div className="product-list-header">
        <Breadcrumbs
          links={[
            {label: 'Home', labelSk: 'Domov', to: `/${language}`},
            {
              label: 'Catalog',
              labelSk: 'Katalóg',
              to: `/${language}/catalog`,
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

      <Suspense fallback={<ProductsSkeleton />}>
        <Await resolve={collections}>
          {(resolvedCollections) => {
            const products = resolvedCollections.flatMap(
              (collection) => collection.products.nodes,
            );

            return (
              <div style={{marginBottom: '48px'}}>
                <div className="products-grid">
                  {products.map((product, index) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      loading={index < 6 ? 'eager' : undefined}
                    />
                  ))}
                </div>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div style={{marginBottom: '48px'}}>
      <div className="products-grid">
        {Array.from({length: 8}).map((_, index) => (
          <div key={index} className="product-skeleton">
            <div className="product-skeleton-image" />
            <div className="product-skeleton-title" />
            <div className="product-skeleton-price" />
          </div>
        ))}
      </div>
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

const CATALOG_COLLECTIONS_QUERY = `#graphql
  query CatalogCollections(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: 20) {
      nodes {
        id
        handle
        title
        products(first: 100) {
          nodes {
            ...CollectionItem
          }
        }
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
