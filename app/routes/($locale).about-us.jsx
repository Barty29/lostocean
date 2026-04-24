import Breadcrumbs from '~/components/Breadcrumbs';
import {useLocale} from '~/hooks/useLocale';
import {motion} from 'framer-motion';

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
        <motion.div
          className="product-list-header"
          initial={{opacity: 0, y: 24}}
          animate={{opacity: 1, y: 0}}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
        >
          <h1 className="np__title">{t.about_us}</h1>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '800px',
              gap: '16px',
            }}
            dangerouslySetInnerHTML={{__html: t.about_us_text}}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
