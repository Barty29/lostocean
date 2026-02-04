import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} reactRouterContext
 * @param {HydrogenRouterContextProvider} context
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  reactRouterContext,
  context,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    imgSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'data:', // Toto povolí tie base64 SVG obrázky
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // ak používaš inline štýly / css-in-js
      'https://cdn.shopify.com',
      'https://fonts.googleapis.com',
    ],
    styleSrcElem: [
      "'self'",
      'https://cdn.shopify.com',
      'https://fonts.googleapis.com',
    ],

    // ✅ toto ti chýba – fonty sa ťahajú z fonts.gstatic.com
    fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
    connectSrc: [
      "'self'",
      'https://api.emailjs.com',
      'https://cdn.shopify.com',
      // Ak testuješ lokálne, pridaj aj localhost
      'http://localhost:*',
      'ws://localhost:*',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/hydrogen').HydrogenRouterContextProvider} HydrogenRouterContextProvider */
/** @typedef {import('react-router').EntryContext} EntryContext */
