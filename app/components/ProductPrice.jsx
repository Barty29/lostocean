import {Money} from '@shopify/hydrogen';
import {getSalePrice} from '~/lib/sale';

/**
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 * }}
 */
export function ProductPrice({
  price: basePrice,
  compareAtPrice: baseCompareAtPrice,
  view = 'product',
}) {
  // V košíku Shopify zľavu prepočíta sám, akciu aplikujeme len na stránke produktu
  const {price, compareAtPrice} =
    view === 'product'
      ? getSalePrice(basePrice, baseCompareAtPrice)
      : {price: basePrice, compareAtPrice: baseCompareAtPrice};

  return (
    <div
      className={`product-price-${view === 'product' ? 'product' : 'cart'}`}
      // style={{fontSize: view === 'product' ? '40px' : '16px'}}
    >
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Money data={price} /> : null}
          <s>
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
