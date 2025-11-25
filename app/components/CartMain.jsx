import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartLineItemPage} from '~/components/CartLineItemPage';
import {CartSummary} from './CartSummary';
import CartLogo from '~/assets/logo-cart.svg';
import Logo from '~/assets/logo-grey.svg';
import {useLocale} from '~/hooks/useLocale';
import Breadcrumbs from '~/components/Breadcrumbs';

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);
  const {t, language} = useLocale();

  if (!cart || !cart.lines || cart.totalQuantity === 0) {
    return (
      <div className="cart-main">
        <CartEmpty hidden={false} layout={layout} />
      </div>
    );
  }

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  // console.log('line', cart.lines);

  return layout === 'page' ? (
    <>
      <div className="layout-cart-page">
        <div className="layout-cart-page-left">
          <div className="layout-padding">
            <div className="product-list-header">
              <Breadcrumbs
                links={[
                  {label: 'Home', labelSk: 'Domov', to: `/${language}`},
                  {
                    label: 'Catalog',
                    labelSk: 'Katalóg',
                    to: `${language}/catalog`,
                  },
                ]}
              />
              {cart && <h1>{t.cart}</h1>}
              <CartEmpty hidden={linesCount} layout={layout} />
              <div className="cart-details-page">
                <div aria-labelledby="cart-lines">
                  <ul>
                    {(cart?.lines?.nodes ?? []).map((line) => (
                      <div className="cart-lines-desktop">
                        <CartLineItemPage
                          key={line.id}
                          line={line}
                          layout={layout}
                        />
                      </div>
                    ))}
                    {(cart?.lines?.nodes ?? []).map((line) => (
                      <div className="cart-lines-mobile">
                        <CartLineItem
                          key={line.id}
                          line={line}
                          layout={layout}
                        />
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="layout-cart-page-right">
          {cartHasItems && (
            <div>
              <div className="cart-summary-page-wraper">
                <img
                  src={Logo}
                  alt="logo"
                  width="50%"
                  style={{alignSelf: 'center'}}
                />
                <CartSummary cart={cart} layout={layout} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  ) : (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <div aria-labelledby="cart-lines">
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty({hidden = false, layout}) {
  const {close} = useAside();
  const {t, language} = useLocale();
  if (hidden) return null;

  return (
    <div
      hidden={hidden}
      style={{
        height: layout === 'page' ? '100vh' : 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="empty-cart"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <p style={{fontSize: '24px', color: '#f9f9f9'}}>{t.cart_empty}</p>
          <img src={CartLogo} alt="cart-logo" width="150px" />
        </div>

        <Link
          to={`/${language}/catalog`}
          onClick={close}
          prefetch="viewport"
          style={{textTransform: 'uppercase', fontSize: '14px'}}
        >
          {t.continue_shoping}
        </Link>
      </div>
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
