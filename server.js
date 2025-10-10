import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/hydrogen/oxygen';
import {createHydrogenRouterContext} from '~/lib/context';
import {getLocaleFromRequest} from '~/lib/locale.server.js';

export default {
  async fetch(request, env, executionContext) {
    try {
      const url = new URL(request.url);
      const accept = request.headers.get('accept') || '';

      // ✅ Zablokuj len Turbo stream, nie .data
      if (
        accept.includes('turbo-stream') ||
        accept.includes('vnd.turbo-stream.html')
      ) {
        console.warn('⛔ Blocked turbo-stream request:', url.pathname);
        return new Response('', {status: 204});
      }

      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      const i18n = getLocaleFromRequest(request);
      hydrogenContext.storefront.i18n = i18n;

      console.log('🌍 Aktuálny jazyk v Hydrogen:', i18n);

      const handleRequest = createRequestHandler({
        build: await import('virtual:react-router/server-build'),
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }

      if (response.status === 404) {
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error('💥 Server error:', error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

// export default {
//   async fetch(request, env, executionContext) {
//     if (request.headers.get('accept')?.includes('text/vnd.turbo-stream.html')) {
//       return new Response('', {status: 204});
//     }
//     try {
//       // 1️⃣ Hydrogen context
//       const hydrogenContext = await createHydrogenRouterContext(
//         request,
//         env,
//         executionContext,
//       );

//       // 2️⃣ Získaj aktuálny jazyk podľa URL
//       const i18n = getLocaleFromRequest(request);

//       // 3️⃣ Pridaj jazykové info do contextu pre Hydrogen
//       hydrogenContext.storefront.i18n = i18n;

//       console.log('🌍 Aktuálny jazyk v Hydrogen:', i18n);

//       // 4️⃣ Remix handler
//       const handleRequest = createRequestHandler({
//         build: await import('virtual:react-router/server-build'),
//         mode: process.env.NODE_ENV,
//         getLoadContext: () => hydrogenContext,
//       });

//       const response = await handleRequest(request);

//       if (hydrogenContext.session.isPending) {
//         response.headers.set(
//           'Set-Cookie',
//           await hydrogenContext.session.commit(),
//         );
//       }

//       if (response.status === 404) {
//         return storefrontRedirect({
//           request,
//           response,
//           storefront: hydrogenContext.storefront,
//         });
//       }

//       return response;
//     } catch (error) {
//       console.error(error);
//       return new Response('An unexpected error occurred', {status: 500});
//     }
//   },
// };

// export default {
//   /**
//    * @param {Request} request
//    * @param {Env} env
//    * @param {ExecutionContext} executionContext
//    * @return {Promise<Response>}
//    */
//   async fetch(request, env, executionContext) {
//     try {
//       const hydrogenContext = await createHydrogenRouterContext(
//         request,
//         env,
//         executionContext,
//       );

//       /**
//        * Create a Remix request handler and pass
//        * Hydrogen's Storefront client to the loader context.
//        */
//       const handleRequest = createRequestHandler({
//         // eslint-disable-next-line import/no-unresolved
//         build: await import('virtual:react-router/server-build'),
//         mode: process.env.NODE_ENV,
//         getLoadContext: () => hydrogenContext,
//       });

//       const response = await handleRequest(request);

//       if (hydrogenContext.session.isPending) {
//         response.headers.set(
//           'Set-Cookie',
//           await hydrogenContext.session.commit(),
//         );
//       }

//       if (response.status === 404) {
//         /**
//          * Check for redirects only when there's a 404 from the app.
//          * If the redirect doesn't exist, then `storefrontRedirect`
//          * will pass through the 404 response.
//          */
//         return storefrontRedirect({
//           request,
//           response,
//           storefront: hydrogenContext.storefront,
//         });
//       }

//       return response;
//     } catch (error) {
//       console.error(error);
//       return new Response('An unexpected error occurred', {status: 500});
//     }
//   },
// };
