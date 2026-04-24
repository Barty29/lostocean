import {Suspense} from 'react';
import {Await} from 'react-router';
import {ProductItem} from '~/components/ProductItem';
import './TopProducts.css';
import {useLocale} from '~/hooks/useLocale';

export default function TopProducts({products}) {
  const {t} = useLocale();
  return (
    <section className="top-products">
      <div className="np__header">
        <span className="np__eyebrow">{t.hp_trending_subheading}</span>
        <h2 className="np__title">{t.hp_trending_title}</h2>
      </div>

      <Suspense fallback={<div className="top-products__loading" />}>
        <Await resolve={products}>
          {(response) => {
            if (!response?.collection?.products?.nodes?.length) return null;
            return (
              <div className="products-grid">
                {response.collection.products.nodes.map((product, index) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </section>
  );
}
