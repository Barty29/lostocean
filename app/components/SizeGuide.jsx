import React, {useState, useEffect, useRef} from 'react';
import {useLocale} from '~/hooks/useLocale';
import SizeGuideTshirt from '~/assets/size-fuide-tshirt.webp';
import SizeGuideHoodie from '~/assets/size-fuide-hoodie.webp';

const SizeGuide = ({collectionHandle}) => {
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);
  const {t} = useLocale();

  const imgSrc =
    collectionHandle === 'hoodies' ? SizeGuideHoodie : SizeGuideTshirt;

  // zatváranie pri kliku mimo cez useEffect
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'transparent',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          textAlign: 'left',
          padding: 0,
        }}
      >
        {t.size_guide}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            // background: 'rgba(0, 0, 0, 0.2)',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999,
          }}
        >
          <div
            ref={modalRef}
            style={{
              background: '#111',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '16px',
              //   borderRadius: '20px',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <img
              src={imgSrc}
              alt="Size Guide"
              style={{
                width: '100%',
                // borderRadius: '12px',
              }}
            />

            <button
              onClick={() => setOpen(false)}
              className="primary-button"
              style={{width: '100%'}}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SizeGuide;
