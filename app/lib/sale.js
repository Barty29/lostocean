// ─── BLACK FRIDAY / AKCIA ────────────────────────────────────
// Shopify automatické zľavy (Discounts) neposiela do Storefront API,
// preto percento musí sedieť so zľavou "BLACK FRIDAY" v admine.
// Po skončení akcie nastav enabled: false (alebo vyplň endsAt).
export const SALE = {
  enabled: true,
  percent: 20,
  // napr. '2026-12-01T00:00:00+01:00' – po tomto čase sa akcia sama vypne
  endsAt: null,
};
// ─────────────────────────────────────────────────────────────

function isSaleActive() {
  if (!SALE.enabled || !SALE.percent) return false;
  if (SALE.endsAt && Date.now() >= new Date(SALE.endsAt).getTime()) {
    return false;
  }
  return true;
}

/**
 * Vráti cenu na zobrazenie, pôvodnú (prečiarknutú) cenu a percento zľavy.
 * Ak je v Shopify nastavená vyššia "Compare-at price", použije sa tá.
 * @param {{amount: string, currencyCode: string} | null | undefined} price
 * @param {{amount: string, currencyCode: string} | null | undefined} compareAtPrice
 */
export function getSalePrice(price, compareAtPrice) {
  const current = Number(price?.amount);
  const original = Number(compareAtPrice?.amount);

  if (current && original > current) {
    return {
      price,
      compareAtPrice,
      percent: Math.round((1 - current / original) * 100),
    };
  }

  if (current && isSaleActive()) {
    const discounted = Math.round(current * (100 - SALE.percent)) / 100;
    return {
      price: {...price, amount: discounted.toFixed(2)},
      compareAtPrice: price,
      percent: SALE.percent,
    };
  }

  return {price, compareAtPrice: null, percent: null};
}
