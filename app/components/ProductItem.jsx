import {useState, useEffect} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

import {useVariantUrl} from '~/lib/variants';
import {useLocale} from '~/hooks/useLocale';

function getProductBadge(product) {
  const handles = product?.collections?.nodes?.map((c) => c.handle) ?? [];

  if (handles.includes('accessories')) {
    if (handles.includes('hat')) return 'HAT';
    return 'BAG';
  }

  // 'hoodies' = EN, 'mikiny' = SK
  if (handles.includes('hoodies') || handles.includes('mikiny'))
    return 'HOODIE';

  // 't-shirts' = EN, 'tricka' = SK — sub-collection handles are the same in both locales
  if (handles.includes('t-shirts') || handles.includes('tricka')) {
    if (handles.includes('kids-t-shirt')) return 'KIDS';
    if (handles.includes('oversized-t-shirts')) return 'OVERSIZED';
    if (handles.includes('washed-t-shirts')) return 'WASHED';
    return 'REGULAR';
  }

  return null;
}

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
  const [isHover, setIsHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const img1 = product?.images?.nodes?.[0] || product.featuredImage;
  const img2 = product?.images?.nodes?.[1];
  const badge = getProductBadge(product);

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
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="product-item-imageWrap">
          {badge && <span className="product-item-badge">{badge}</span>}
          {/* <span className="product-item-badge">BADGE</span> */}
          {/* SSR / pred hydratáciou: renderuj len prvý obrázok (stabilné) */}
          {!mounted ? (
            img1 && (
              <Image
                data={img1}
                alt={img1.altText || product.title}
                loading={loading}
                sizes="(min-width: 45em) 400px, 100vw"
              />
            )
          ) : (
            /* Po hydratácii: plynulý prechod img1 -> img2 cez overlay */
            <>
              {img1 && (
                <Image
                  data={img1}
                  alt={img1.altText || product.title}
                  loading={loading}
                  sizes="(min-width: 45em) 400px, 100vw"
                />
              )}

              {img2 && (
                <motion.div
                  className="product-item-imageOverlay"
                  initial={false}
                  animate={{
                    opacity: isHover ? 1 : 0,
                  }}
                  transition={{duration: 0.25, ease: 'easeOut'}}
                >
                  <Image
                    data={img2}
                    alt={img2.altText || product.title}
                    loading={loading}
                    sizes="(min-width: 45em) 400px, 100vw"
                  />
                </motion.div>
              )}
            </>
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
