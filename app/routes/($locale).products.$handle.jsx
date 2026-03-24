import {useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

import {useLocale} from '~/hooks/useLocale';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {Gallery} from '~/components/Gallery';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import SizeGuide from '~/components/SizeGuide';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `Lost Ocean | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
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
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const i18n = storefront.i18n; // 👈 pridaj toto

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions: getSelectedProductOptions(request),
        language: i18n.language, // 👈 pridaj tieto dve
        country: i18n.country, // 👈 pridaj tieto dve
      },
    }),
  ]);

  // const [{product}] = await Promise.all([
  //   storefront.query(PRODUCT_QUERY, {
  //     variables: {handle, selectedOptions: getSelectedProductOptions(request)},
  //   }),
  //   // Add other queries here, so that they are loaded in parallel
  // ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context, params}) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product} = useLoaderData();
  const {t} = useLocale();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;
  const collections = product.collections?.nodes || [];
  let collectionHandle = '';

  if (collections.length > 0) {
    collectionHandle = collections[0].handle;
  }

  const printType = selectedVariant?.selectedOptions.find(
    (opt) => opt.name === 'print-type',
  );

  // TODO LOCALE, vratit 0 / 1 a podla toho if ?
  let printTypeLabel = printType ? printType.value : '';

  return (
    <div className="product">
      {/* <ProductImage image={selectedVariant?.image} /> */}
      <Gallery images={product.images.nodes} />
      <motion.div
        className="product-list-header"
        initial={{opacity: 0, y: 24}}
        animate={{opacity: 1, y: 0}}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
      >
        <div className="product-wrapper">
          <div className="product-main">
            <div>
              <h1>{title}</h1>
              <p style={{marginTop: '8px', color: 'rgb(191, 191, 191)'}}>
                {printTypeLabel}
              </p>
            </div>
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />

            <div
              style={{color: 'rgb(191, 191, 191)'}}
              dangerouslySetInnerHTML={{__html: descriptionHtml}}
            />
            <hr className="divider-primary" />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              {collectionHandle === 'accessories' ? null : (
                <SizeGuide collectionHandle={collectionHandle} />
              )}
              {/* <p>{t.delivery_info}</p> */}
            </div>
          </div>
        </div>
      </motion.div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    collections(first: 5) {
      nodes {
        title
        handle
        id
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
