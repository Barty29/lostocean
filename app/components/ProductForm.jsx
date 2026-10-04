import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {useLocale} from '~/hooks/useLocale';
import {isColorOption, sortColorValues} from '~/lib/colors';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductForm({productOptions, selectedVariant}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const {t} = useLocale();
  const visibleOptions = productOptions.filter(
    (option) => option.optionValues.length > 1,
  );
  // Väčšia medzera len keď má produkt farby aj veľkosti (napr. svetre, nie tašky)
  const hasMultipleOptions = visibleOptions.length > 1;

  return (
    <div
      className={`product-form${
        hasMultipleOptions ? ' product-form--multi' : ''
      }`}
    >
      {visibleOptions.map((option) => {
        const isColor = isColorOption(option);
        const values = isColor
          ? sortColorValues(option.optionValues)
          : option.optionValues;

        return (
          <div
            className={`product-options${
              isColor ? ' product-options--color' : ''
            }`}
            key={option.name}
          >
            {/* <h5>{option.name}</h5> */}
            <div className="product-options-grid">
              {values.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      aria-label={isColor ? name : undefined}
                      data-label={isColor ? name : undefined}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={`product-options-item${
                        exists && !selected ? ' link' : ''
                      }`}
                      key={option.name + name}
                      aria-label={isColor ? name : undefined}
                      data-label={isColor ? name : undefined}
                      style={{
                        fontSize: '24px',
                        minWidth: '40px',
                        backgroundColor: selected ? '#2e3c50' : 'transparent',
                        color: selected ? '#f9f9f9' : 'rgb(191, 191, 191)',
                        borderRadius: '100px',
                        opacity: available ? 1 : 0.3,
                        border: 'none',
                      }}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
      {/* <div className="product-status">
        <span className="status-dot"></span>
        IN STOCK, READY TO SHIP
      </div> */}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        isAvailable={selectedVariant?.availableForSale}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? t.add_to_cart : t.sold_out}
      </AddToCartButton>
    </div>
  );
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
