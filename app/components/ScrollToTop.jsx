import {useEffect} from 'react';
import {useLocation} from 'react-router';

const ScrollToTop = () => {
  const {pathname} = useLocation();

  useEffect(() => {
    // Detail produktu — vždy scroll na vrch
    if (pathname.includes('/products/')) {
      window.scrollTo({top: 0});
      return;
    }

    // Iné stránky (nie list produktov)
    const isCatalogPage = pathname.includes('/catalog');

    if (!isCatalogPage) {
      window.scrollTo({top: 0});
    }

    // Ak je to catalog/list → nechaj browser zachovať pozíciu
  }, [pathname]);

  return null;
};

export default ScrollToTop;
