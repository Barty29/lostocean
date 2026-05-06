import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';

export const meta = ({params}) => {
  const language = params.locale || 'en';
  const title =
    language === 'sk' ? 'Mikiny | Lost Ocean' : 'Hoodies | Lost Ocean';
  return [{title}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 100});

  const [{collection}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {
        handle: 'hoodies',
        ...paginationVariables,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    }),
  ]);

  return {collection};
}

function loadDeferredData() {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData();
  const products = collection?.products?.nodes ?? [];

  return (
    <div style={{marginBottom: '48px'}}>
      <div className="products-grid">
        {products.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
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

const CATALOG_QUERY = `#graphql
  query CollectionProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
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
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
