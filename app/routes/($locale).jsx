export function loader({params}) {
  const {locale} = params;

  // ak je undefined alebo prazdne = root URL (/) -> ignoruj
  if (!locale) {
    return null;
  }

  // validné prefixy
  const validLocales = ['sk', 'en'];

  // ak prefix nie je sk/en → 404
  if (!validLocales.includes(locale)) {
    throw new Response('Not Found', {status: 404});
  }

  return null;
}
