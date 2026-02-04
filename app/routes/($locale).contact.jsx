'use client';

import emailjs from '@emailjs/browser';
import {useRef, useState, useEffect} from 'react';
import Breadcrumbs from '~/components/Breadcrumbs';
import {useLocale} from '~/hooks/useLocale';
import Snackbar from '~/components/Snackbar';

import {AnimatePresence, motion} from 'framer-motion';

const Contact = () => {
  const {t, language} = useLocale();
  const form = useRef();
  const [status, setStatus] = useState(''); // Na sledovanie stavu (odosielanie/úspech)

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('');
      }, 10000); // 10 sekúnd

      return () => clearTimeout(timer);
    }
  }, [status]);

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const botTrap = formData.get('website_url');

    if (botTrap) {
      setStatus('success'); // Oklameme bota, že sa to podarilo
      e.target.reset();
      return;
    }

    setStatus('sending');

    // DÔLEŽITÉ: Používame priamo e.currentTarget, čo je spoľahlivejšie
    emailjs
      .sendForm(
        'service_9bjpcn5',
        'template_702johi',
        e.currentTarget, // Namiesto form.current skús e.currentTarget
        {
          publicKey: 'oK-PeuASAZttOCQiM',
        },
      )
      .then(
        () => {
          console.log('SUCCESS!');
          setStatus('success');
          e.target.reset(); // Vyčistí formulár po úspechu
        },
        (error) => {
          console.log('FAILED...', error);
          setStatus('error');
        },
      );
  };

  return (
    <motion.div
      initial={{opacity: 0, y: 24}}
      animate={{opacity: 1, y: 0}}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      <div className="layout-padding">
        <div className="product-list-header">
          <Breadcrumbs
            links={[
              {label: 'Home', labelSk: 'Domov', to: `/${language}`},
              {
                label: 'Contact',
                labelSk: 'Kontakt',
                to: `/${language}/contact`,
              },
            ]}
          />
          <h1>{t.contact_heading}</h1>

          <form ref={form} onSubmit={sendEmail} className="contact-form">
            <div
              style={{
                position: 'absolute',
                opacity: 0,
                zIndex: -1,
                left: '-5000px',
              }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="website_url"
                tabIndex="-1"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="email" className="contact-form-label">
                {t.email_address}
              </label>

              <input
                type="email"
                id="email"
                name="from_email"
                placeholder={t.your_email_address}
                className="contact-form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="contact-form-label">
                {t.message_label}
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder={t.message}
                className="contact-form-input"
                required
                style={{
                  resize: 'vertical',
                  marginTop: '4px',
                }}
              />
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={status === 'sending'}
              style={{marginTop: '8px'}}
            >
              {status === 'sending' ? t.sending : t.send}
            </button>
            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' && (
                <Snackbar
                  key="success"
                  message={t.success}
                  type="success"
                  onClose={() => setStatus('')}
                />
              )}
              {status === 'error' && (
                <Snackbar
                  key="error"
                  message={t.error_sending_message}
                  type="error"
                  onClose={() => setStatus('')}
                />
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
