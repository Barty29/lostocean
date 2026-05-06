import {Suspense} from 'react';
import {Await, useLoaderData} from 'react-router';
import {ProductItem} from '~/components/ProductItem';

export const meta = ({params}) => {
  const language = params.locale || 'en';
  const title =
    language === 'sk' ? 'Produkty | Lost Ocean' : 'Products | Lost Ocean';
  return [{title}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData() {
  return {};
}

function loadDeferredData({context}) {
  const {storefront} = context;

  const collections = storefront
    .query(CATALOG_COLLECTIONS_QUERY, {
      variables: {
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    })
    .then(({tshirts, hoodies, accessories, kids}) => {
      return [tshirts, hoodies, accessories, kids].filter(Boolean);
    });

  return {collections};
}

export default function Collection() {
  const {collections} = useLoaderData();

  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <Await resolve={collections}>
        {(resolvedCollections) => {
          const seen = new Set();
          const products = [];
          for (const collection of resolvedCollections) {
            for (const product of collection.products.nodes) {
              if (!seen.has(product.id)) {
                seen.add(product.id);
                products.push(product);
              }
            }
          }

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
    collections(first: 5) {
      nodes {
        handle
      }
    }
  }
`;

const CATALOG_COLLECTIONS_QUERY = `#graphql
  query CatalogCollections(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    tshirts: collection(handle: "t-shirts") {
      id
      handle
      title
      products(first: 100) {
        nodes {
          ...CollectionItem
        }
      }
    }
    hoodies: collection(handle: "hoodies") {
      id
      handle
      title
      products(first: 100) {
        nodes {
          ...CollectionItem
        }
      }
    }
    accessories: collection(handle: "accessories") {
      id
      handle
      title
      products(first: 100) {
        nodes {
          ...CollectionItem
        }
      }
    }
    kids: collection(handle: "kids-t-shirt") {
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
  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
