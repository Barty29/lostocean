import {Outlet, useLocation, useMatches} from 'react-router';
import {useLocale} from '~/hooks/useLocale';
import CollectionHeader from '~/components/CollectionHeader';
import CatalogFilterBar from '~/components/CatalogFilterBar';

function getActiveCatalog(pathname) {
  if (/\/catalog\/t-shirts/.test(pathname)) return 't-shirts';
  if (/\/catalog\/hoodies/.test(pathname)) return 'hoodies';
  if (/\/catalog\/accessories/.test(pathname)) return 'accessories';
  if (/\/catalog\/kids/.test(pathname)) return 'kids';
  if (/\/catalog\/.+/.test(pathname)) return 'other';
  return 'all';
}

export default function CatalogLayout() {
  const {pathname, search} = useLocation();
  const {t, language} = useLocale();
  const matches = useMatches();
  const activeCatalog = getActiveCatalog(pathname);
  const activeType = new URLSearchParams(search).get('type') ?? 'all';

  // For the $handle catch-all, get collection title from the leaf route's loader data
  const lastRouteData = matches.at(-1)?.data ?? {};
  const catchAllCollection = lastRouteData.collection;

  let title;
  if (activeCatalog === 't-shirts') {
    const typeHeadings = {
      regular: t.catalog_heading_regular,
      washed: t.catalog_heading_washed,
      oversized: t.catalog_heading_oversized,
    };
    title = typeHeadings[activeType] ?? t.catalog_heading_tshirts;
  } else if (activeCatalog === 'hoodies') {
    title = t.catalog_heading_hoodies;
  } else if (activeCatalog === 'accessories') {
    title = t.catalog_heading_accessories;
  } else if (activeCatalog === 'kids') {
    title = t.catalog_heading_kids;
  } else if (activeCatalog === 'other') {
    title = catchAllCollection?.title ?? '';
  } else {
    title = t.catalog_heading_all;
  }

  const description =
    activeCatalog === 'other'
      ? catchAllCollection?.description
      : t.catalog_description;

  const breadcrumbs = [
    {label: 'Home', labelSk: 'Domov', to: `/${language}`},
    {label: 'Catalog', labelSk: 'Katalóg', to: `/${language}/catalog`},
  ];

  return (
    <div>
      <CollectionHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />
      <div className="layout-padding" style={{paddingTop: '32px'}}>
        <CatalogFilterBar activeCatalog={activeCatalog} />
        <hr className="divider" style={{marginTop: '24px'}} />
        <Outlet />
      </div>
    </div>
  );
}
