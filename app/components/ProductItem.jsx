import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {useLocale} from '~/hooks/useLocale';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const {language} = useLocale();
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  console.log('image', image);
  console.log('product', product);

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={`/${language}${variantUrl}`}
    >
      {image && (
        <Image
          alt={image.altText || product.title}
          data={image}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <div className="product-item-text">
        <h4>{product.title}</h4>
        {/* <small> */}
        <Money data={product.priceRange.minVariantPrice} />
        {/* </small> */}
      </div>
    </Link>
    // <Link
    //   className="product-item"
    //   key={product.id}
    //   prefetch="intent"
    //   to={variantUrl}
    // >
    //   {image && (
    //     <Image
    //       alt={image.altText || product.title}
    //       // aspectRatio="1/1"
    //       data={image}
    //       loading={loading}
    //       sizes="(min-width: 45em) 400px, 100vw"
    //     />
    //   )}
    //   <div className="product-item-text">
    //     <h4>{product.title}</h4>
    //     <small>
    //       <Money data={product.priceRange.minVariantPrice} />
    //     </small>
    //   </div>
    // </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
