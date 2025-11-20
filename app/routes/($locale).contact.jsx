import Breadcrumbs from '~/components/Breadcrumbs';
import {useLocale} from '~/hooks/useLocale';
import ContactForm from '~/components/ContactForm';

const Contact = () => {
  const {t, language} = useLocale();

  return (
    <div className="layout-padding">
      <div className="product-list-header">
        <Breadcrumbs
          links={[
            {label: 'Home', labelSk: 'Domov', to: `/${language}`},
            {
              label: 'Contact',
              labelSk: 'Kontakt',
              to: `${language}/contact`,
            },
          ]}
        />
        <h1>{t.contact_heading}</h1>
        <p>
          {t.contact_text}{' '}
          <a
            href="mailto:hello@lostoceanapparel.com"
            aria-label="Email to Lost Ocean"
            style={{
              fontWeight: '500',
              color: '#485d7c',
              textDecoration: 'underline',
            }}
          >
            hello@lostoceanapparel.com
          </a>{' '}
          {t.contact_text2}
        </p>
        {/* <ContactForm /> */}
      </div>
    </div>
  );
};

export default Contact;
