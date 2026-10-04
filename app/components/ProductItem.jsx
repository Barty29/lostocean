import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

import {useVariantUrl} from '~/lib/variants';
import {useLocale} from '~/hooks/useLocale';
import {isColorOption, resolveColor, sortColorValues} from '~/lib/colors';

function getProductBadge(product) {
  const handles = product?.collections?.nodes?.map((c) => c.handle) ?? [];

  if (handles.includes('accessories')) {
    if (handles.includes('hat')) return 'HAT';
    return 'BAG';
  }

  // 'hoodies' = EN, 'mikiny' = SK
  if (handles.includes('hoodies') || handles.includes('mikiny'))
    return 'HOODIE';

  if (handles.includes('sweatshirts')) return 'SWEATSHIRT';

  // 't-shirts' = EN, 'tricka' = SK — sub-collection handles are the same in both locales
  if (handles.includes('t-shirts') || handles.includes('tricka')) {
    if (handles.includes('kids-t-shirt')) return 'KIDS';
    if (handles.includes('oversized-t-shirts')) return 'OVERSIZED';
    if (handles.includes('washed-t-shirts')) return 'WASHED';
    return 'REGULAR';
  }

  return null;
}

function getColorValues(product) {
  const option = product?.options?.find(isColorOption);
  const values = option?.optionValues ?? [];
  return values.length > 1 ? sortColorValues(values) : [];
}

const MAX_DOTS = 4;

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
  const img1 = product?.images?.nodes?.[0] || product.featuredImage;
  const img2 = product?.images?.nodes?.[1];
  const badge = getProductBadge(product);
  const colors = getColorValues(product);

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.9}}
      whileInView={{opacity: 1, scale: 1}}
      viewport={{once: true}}
      transition={{duration: 0.5}}
    >
      <Link
        className="product-item"
        to={`/${language}${variantUrl}`}
      >
        <div className="product-item-imageWrap">
          {badge && <span className="product-item-badge">{badge}</span>}
          {/* <span className="product-item-badge">BADGE</span> */}
          {colors.length > 0 && (
            <div
              className="product-item-colors"
              aria-label={`Available in ${colors.length} colors`}
            >
              <span className="product-item-colors__dots">
                {colors.slice(0, MAX_DOTS).map((value) => (
                  <span
                    key={value.name}
                    className="product-item-colors__dot"
                    title={value.name}
                    style={{backgroundColor: resolveColor(value)}}
                  />
                ))}
              </span>
              <span className="product-item-colors__label">
                {colors.length > MAX_DOTS
                  ? `+${colors.length - MAX_DOTS} more`
                  : `${colors.length} colors`}
              </span>
            </div>
          )}
          {img1 && (
            <Image
              data={img1}
              alt={img1.altText || product.title}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
            />
          )}

          {/* Druhá fotka je stále v DOM, hover crossfade rieši čisto CSS */}
          {img2 && (
            <div className="product-item-imageOverlay" aria-hidden="true">
              <Image
                data={img2}
                alt=""
                loading={loading}
                sizes="(min-width: 45em) 400px, 100vw"
              />
            </div>
          )}
        </div>

        <div className="product-item-text">
          <h4>{product.title}</h4>
          <Money data={product.priceRange.minVariantPrice} />
        </div>
      </Link>
    </motion.div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
