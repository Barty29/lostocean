import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import TrashIcon from '~/assets/trash-icon.svg';

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 * @param {{
 *   layout: CartLayout;
 *   line: CartLine;
 * }}
 */
export function CartLineItem({layout, line}) {
  const {id, merchandise, isOptimistic} = line;

  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  // const customImage = product.images.nodes[1];
  // const customImage =
  //   product?.images?.nodes?.[1] ?? product?.image ?? merchandise?.image ?? null;

  const customImage =
    merchandise?.image ||
    product?.featuredImage ||
    product?.image ||
    product?.images?.nodes?.[0] ||
    null;

  // console.log('selectedOptions', selectedOptions);
  console.log('merchandise', merchandise);
  // console.log('line', line);

  // const printType = selectedOptions.find((opt) => opt.name === 'print-type');

  return (
    <li
      key={id}
      className="cart-line"
      style={{
        width: '100%',
      }}
    >
      <div className="cart-line-gradient">
        {customImage ? (
          <Image alt={title} data={customImage} loading="lazy" width={110} />
        ) : (
          <div style={{width: 110, height: 110, background: '#333'}} />
        )}
      </div>

      {/* {image && <Image alt={title} data={image} loading="lazy" width={110} />} */}

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <span>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              // alignItems: 'center',
              width: '100%',
            }}
          >
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => {
                if (layout === 'aside') {
                  close();
                }
              }}
            >
              <p>
                <strong>{product.title}</strong>
              </p>
            </Link>

            <CartLineRemoveButton lineIds={[id]} disabled={!!isOptimistic} />
          </div>

          <i
            style={{
              fontWeight: '200',
              color: '#BFBFBF',
              // lineHeight: 1,
              fontSize: '14px',
            }}
          >
            {/* {printType.value} */}
          </i>
          <p
            style={{
              fontWeight: '200',
              color: '#BFBFBF',
              // lineHeight: 1,
              fontSize: '14px',
            }}
          >
            {title}
          </p>
        </span>

        {/* <ProductPrice price={line?.cost?.amountPerQuantity} />
        <CartLineQuantity line={line} /> */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            // alignItems: 'center',
          }}
        >
          <ProductPrice price={line?.cost?.amountPerQuantity} view="cart" />
          <CartLineQuantity line={line} />
        </div>
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 * @param {{line: CartLine}}
 */
function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#f9f9f9',
            cursor: 'pointer',
          }}
        >
          <span>&#8722; </span>
        </button>
      </CartLineUpdateButton>
      {quantity}
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#f9f9f9',
            cursor: 'pointer',
          }}
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 * @param {{
 *   lineIds: string[];
 *   disabled: boolean;
 * }}
 */
function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <img
          src={TrashIcon}
          alt="trash-icon"
          width="16px"
          style={{margin: '0px'}}
        />
      </button>
    </CartForm>
  );
}

/**
 * @param {{
 *   children: React.ReactNode;
 *   lines: CartLineUpdateInput[];
 * }}
 */
function CartLineUpdateButton({children, lines}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @returns
 * @param {string[]} lineIds - line ids affected by the update
 */
function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
