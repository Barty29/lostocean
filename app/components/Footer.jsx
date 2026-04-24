import {Link, useLocation, useNavigate} from 'react-router';
import {useLocale} from '~/hooks/useLocale';
import InstagramIcon from '~/assets/instagram-icon.svg';
import FacebookIcon from '~/assets/fb-icon.svg';
import './Footer.css';

const LANGS = [
  {code: 'en', label: 'EN'},
  {code: 'sk', label: 'SK'},
];

function LangSwitcher() {
  const {language, changeLanguage} = useLocale();
  const {pathname, search} = useLocation();
  const navigate = useNavigate();

  const changeLang = (code) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|sk)(?=\/|$)/, '');
    changeLanguage(code);
    navigate(`/${code}${pathWithoutLocale}${search}`, {replace: false});
  };

  return (
    <div className="footer__lang">
      <button
        onClick={() => changeLang('en')}
        disabled={'en' === language}
        className={`footer__lang-btn${'en' === language ? ' footer__lang-btn--active' : ''}`}
      >
        EN
      </button>
      <span className="footer__lang-divider">/</span>
      <button
        onClick={() => changeLang('sk')}
        disabled={'sk' === language}
        className={`footer__lang-btn${'sk' === language ? ' footer__lang-btn--active' : ''}`}
      >
        SK
      </button>
    </div>
  );
}

const SHOP_LINKS = [
  {label: 'All Items', to: 'catalog'},
  {label: 'Hoodies', to: 'catalog/hoodies'},
  {label: 'T-shirts', to: 'catalog/t-shirts'},
  {label: 'Accessories', to: 'catalog/accessories'},
];

const SUPPORT_LINKS = [
  {label: 'Contact Us', to: 'contact'},
  {label: 'Shipping & Returns', to: 'faq'},
  {label: 'FAQ', to: 'faq'},
  {label: 'Order Tracking', to: 'faq'},
];

const LEGAL_LINKS = [
  {label: 'Privacy Policy', to: 'policies/privacy-policy'},
  {label: 'Terms of Service', to: 'policies/privacy-policy'},
  {label: 'Cookies', to: 'policies/privacy-policy'},
];

const SOCIAL_LINKS = [
  {
    icon: InstagramIcon,
    alt: 'Instagram',
    href: 'https://www.instagram.com/lostoceanclth/',
  },
  {
    icon: FacebookIcon,
    alt: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61586088478610',
  },
];

export function Footer() {
  const {language} = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* ── Top row: brand name + social ───────────────────── */}
      <div className="footer__top">
        <Link to={`/${language}`} className="footer__brand">
          Lost Ocean
        </Link>
        <nav className="footer__social" aria-label="Social links">
          {SOCIAL_LINKS.map(({icon, alt, href}) => (
            <a
              key={alt}
              href={href}
              className="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={alt}
            >
              <img src={icon} alt={alt} className="footer__social-icon" />
            </a>
          ))}
        </nav>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="footer__divider" />

      {/* ── Three link columns ──────────────────────────────── */}
      <div className="footer__nav">
        <div className="footer__col">
          <p className="footer__col-heading">Shop</p>
          {SHOP_LINKS.map(({label, to}) => (
            <Link
              key={label}
              to={`/${language}/${to}`}
              className="footer__link"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="footer__col">
          <p className="footer__col-heading">Support</p>
          {SUPPORT_LINKS.map(({label, to}) => (
            <Link
              key={label}
              to={`/${language}/${to}`}
              className="footer__link"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="footer__col">
          <p className="footer__col-heading">Legal</p>
          {LEGAL_LINKS.map(({label, to}) => (
            <Link
              key={label}
              to={`/${language}/${to}`}
              className="footer__link"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────── */}
      <div className="footer__bottom">
        <LangSwitcher />
        <span>© {year} Lost Ocean. All rights reserved.</span>
        <span>Built for the Community</span>
      </div>
    </footer>
  );
}
