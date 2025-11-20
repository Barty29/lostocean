import Breadcrumbs from '~/components/Breadcrumbs';
import {useLocale} from '~/hooks/useLocale';

const AboutUs = () => {
  const {t, language} = useLocale();

  return (
    <div className="layout-padding">
      <div className="product-list-header">
        <Breadcrumbs
          links={[
            {label: 'Home', labelSk: 'Domov', to: `/${language}`},
            {
              label: 'About us',
              labelSk: 'O nás',
              to: `${language}/about-us`,
            },
          ]}
        />
        <h1>{t.about_us}</h1>
        <div
          style={{display: 'flex', flexDirection: 'column', gap: '16px'}}
          dangerouslySetInnerHTML={{__html: t.about_us_text}}
        />
      </div>
    </div>
  );
};

export default AboutUs;
