import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

import ArrowRight from '~/assets/arrow-right.svg';
import ArrowLeft from '~/assets/arrow-left.svg';

export function Gallery({images = []}) {
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  // const Images = images.length > 1 ? images.slice(1) : images;

  const prev = () => setIndex(index === 0 ? images.length - 1 : index - 1);
  const next = () => setIndex(index === images.length - 1 ? 0 : index + 1);

  return (
    <div className="gallery">
      <div className="main">
        {images.length > 1 && (
          <button className="arrow arrow-left" onClick={prev}>
            <img src={ArrowLeft} alt="arrow-icon" />
          </button>
        )}
        <motion.div
          initial={{opacity: 0, scale: 0.9}}
          whileInView={{opacity: 1, scale: 1}}
          viewport={{once: true}}
          transition={{duration: 0.5}}
        >
          <div className="photo">
            <Image
              data={images[index]}
              alt="Product image"
              width={1200}
              loading="eager"
            />
          </div>{' '}
        </motion.div>

        {images.length > 1 && (
          <button className="arrow arrow-right" onClick={next}>
            <img src={ArrowRight} alt="arrow-icon" />
          </button>
        )}
      </div>

      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            className={`dot ${i === index ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
