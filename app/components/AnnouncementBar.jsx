import {useState, useEffect} from 'react';
import './AnnouncementBar.css';
import {useLocale} from '~/hooks/useLocale';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('bar-open');
    return () => document.documentElement.classList.remove('bar-open');
  }, []);

  function handleClose() {
    setClosing(true);
    document.documentElement.classList.remove('bar-open');
    setTimeout(() => setVisible(false), 320);
  }

  const {t} = useLocale();

  if (!visible) return null;

  return (
    <div
      className={`announcement-bar${closing ? ' announcement-bar--closing' : ''}`}
      role="banner"
    >
      <p className="announcement-bar__text">
        {t.announcement_text}
        <span
        // className="announcement-bar__code"
        >
          &nbsp;LOSTOCEAN10
        </span>
      </p>
      <button
        className="announcement-bar__close"
        onClick={handleClose}
        aria-label="Close announcement"
      >
        ✕
      </button>
    </div>
  );
}
