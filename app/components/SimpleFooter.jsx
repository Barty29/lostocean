import React from 'react';
import LanguageSwitcher from '~/components/LanguageSwitcher';
import InstagramIcon from '~/assets/instagram-icon.svg';
import FacebookIcon from '~/assets/fb-icon.svg';

const SimpleFooter = () => {
  return (
    <div className="footer-simple">
      <LanguageSwitcher />
      <div
        style={{
          display: 'flex',
          gap: '24px',
          fontSize: '24px',
          color: '#F9F9F9',
        }}
      >
        <a href="" target="_blank" className="social-text">
          Instagram
        </a>
        <a href="" target="_blank" className="social-text">
          Facebook
        </a>
        <a href="" target="_blank" className="social-icons">
          <img src={InstagramIcon} alt="instagram-icon" />
        </a>
        <a href="" target="_blank" className="social-icons">
          <img src={FacebookIcon} alt="facebook-icon" />
        </a>
      </div>
    </div>
  );
};

export default SimpleFooter;
