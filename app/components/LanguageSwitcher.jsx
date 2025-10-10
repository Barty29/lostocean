import {useLocation, useNavigate, useParams} from 'react-router';
import {useLocale} from '~/hooks/useLocale'; // 👈 pridaj

export default function LanguageSwitcher() {
  const {locale} = useParams(); // 'en' | 'sk' | undefined
  const navigate = useNavigate();
  const {pathname, search} = useLocation();
  const {changeLanguage, language} = useLocale(); // 👈 pridaj

  const langs = [
    {code: 'en', label: 'EN'},
    {code: 'sk', label: 'SK'},
  ];

  const changeLang = (lang) => {
    // odstráni aktuálny prefix /en alebo /sk
    const pathWithoutLocale = pathname.replace(/^\/(en|sk)(?=\/|$)/, '');
    const newPath = `/${lang}${pathWithoutLocale}${search}`;

    // 1️⃣ aktualizuj Context (UI texty sa prepnú okamžite)
    changeLanguage(lang);

    // 2️⃣ naviguj na novú jazykovú URL
    navigate(newPath, {replace: false});
  };

  return (
    <div style={{display: 'flex', gap: '10px'}}>
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => changeLang(l.code)}
          disabled={l.code === language} // 👈 používaj z Contextu
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            color: l.code === language ? '#F9F9F9' : '#484848',
            cursor: 'pointer',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
