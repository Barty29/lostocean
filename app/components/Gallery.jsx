import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import ArrowRight from '~/assets/arrow-right.svg';
import ArrowLeft from '~/assets/arrow-left.svg';

export function Gallery({images = []}) {
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const Images = images.length > 1 ? images.slice(1) : images;

  const prev = () => setIndex(index === 0 ? Images.length - 1 : index - 1);
  const next = () => setIndex(index === Images.length - 1 ? 0 : index + 1);

  return (
    <div className="gallery">
      <div className="main">
        <button className="arrow arrow-left" onClick={prev}>
          <img src={ArrowLeft} alt="arrow-icon" />
        </button>

        <div className="photo">
          <Image
            data={Images[index]}
            alt="Product image"
            width={1200}
            loading="eager"
          />
        </div>

        <button className="arrow arrow-right" onClick={next}>
          <img src={ArrowRight} alt="arrow-icon" />
        </button>
      </div>

      <div className="dots">
        {Images.map((_, i) => (
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
