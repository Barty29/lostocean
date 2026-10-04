// Spoločné helpery pre farebné varianty (list aj detail produktu)

// Fallback, ak farba nemá v Shopify nastavený swatch
const COLOR_NAME_MAP = {
  black: '#111111',
  cierna: '#111111',
  white: '#f5f5f5',
  biela: '#f5f5f5',
  grey: '#8a8a8a',
  gray: '#8a8a8a',
  siva: '#8a8a8a',
  'heather grey': '#a3a3a3',
  anthracite: '#3b3d40',
  antracit: '#3b3d40',
  navy: '#1f2a44',
  blue: '#2f5d9e',
  modra: '#2f5d9e',
  red: '#a3242b',
  cervena: '#a3242b',
  burgundy: '#5e1a24',
  green: '#3d5a3a',
  zelena: '#3d5a3a',
  olive: '#5b5a36',
  brown: '#5a3d2b',
  hneda: '#5a3d2b',
  coffee: '#4b3326',
  kava: '#4b3326',
  beige: '#d8c8ae',
  bezova: '#d8c8ae',
  sand: '#cbb994',
  cream: '#efe6d2',
  pink: '#e3a6b4',
  ruzova: '#e3a6b4',
  purple: '#5b3a72',
  fialova: '#5b3a72',
};

// Pevné poradie farieb: čierna → hnedá (coffee) → šedá (antracit), ostatné za nimi
const COLOR_ORDER = [
  /black|cierna/,
  /coffee|brown|hneda|kava/,
  /anthra|antra|grey|gray|siva|seda/,
];

function normalize(name) {
  return (name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export function isColorOption(option) {
  return /^(colou?r|farba|barva)$/i.test(option?.name?.trim() ?? '');
}

export function resolveColor(value) {
  if (value?.swatch?.color) return value.swatch.color;
  return COLOR_NAME_MAP[normalize(value?.name)] ?? '#777777';
}

function colorRank(name) {
  const n = normalize(name);
  const index = COLOR_ORDER.findIndex((re) => re.test(n));
  return index === -1 ? COLOR_ORDER.length : index;
}

export function sortColorValues(values) {
  return [...values].sort((a, b) => colorRank(a.name) - colorRank(b.name));
}
