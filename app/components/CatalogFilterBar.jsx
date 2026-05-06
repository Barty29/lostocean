import {Link, useLocation} from 'react-router';
import {motion} from 'framer-motion';
import {useLocale} from '~/hooks/useLocale';

import regularImg from '../assets/instagram/instagram_01.jpg';
import washedImg from '../assets/collection/avatar_washed.jpg';
import oversizedImg from '../assets/collection/avatar_oversized1.jpg';
import allImg from '../assets/collection/avatar_all.jpg';
import tshirtsImg from '../assets/collection/avatar_tee.jpg';
import hoodiesImg from '../assets/collection/avatar_hoodie.jpg';
import accessoriesImg from '../assets/collection/avatar_accessories.jpg';
import kidsImg from '../assets/collection/avatar_kids.jpg';

const TYPE_AVATARS = {
  regular: regularImg,
  washed: washedImg,
  oversized: oversizedImg,
};

const SUB_TYPES = [
  {type: 'regular', label: 'REGULAR'},
  {type: 'washed', label: 'WASHED'},
  {type: 'oversized', label: 'OVERSIZED'},
];

const SPRING = {type: 'spring', stiffness: 320, damping: 26};
const LAYOUT_TRANSITION = {layout: {duration: 0.13, ease: 'easeOut'}};

export default function CatalogFilterBar({activeCatalog}) {
  const {t} = useLocale();
  const {search} = useLocation();
  const activeType = new URLSearchParams(search).get('type') ?? 'all';

  const isExpanded = activeCatalog === 't-shirts';

  return (
    <div className="tfa-scroll">
      <motion.div className="tfa-row">
        <motion.div layout="position" transition={LAYOUT_TRANSITION} key="all" style={{flexShrink: 0}}>
          <FilterAvatar
            label={t.filter_label_all}
            url=""
            image={allImg}
            active={activeCatalog === 'all'}
          />
        </motion.div>

        {/* T-Shirts group — layout="position" prevents width-shrink stretching */}
        <motion.div layout="position" transition={LAYOUT_TRANSITION} key="tshirts-group" className="tfa-group">
          {/* Pill — appears on enter, disappears instantly on exit */}
          {isExpanded && (
            <motion.div
              key="pill"
              className="tfa-group__bg"
              initial={{opacity: 0, scaleX: 0.75}}
              animate={{opacity: 1, scaleX: 1}}
              transition={{...SPRING, damping: 30}}
              style={{originX: 0.08, originY: 0.5}}
            />
          )}

          <div className="tfa-group__items">
            <FilterAvatar
              label={t.filter_label_tshirts}
              url="t-shirts"
              image={tshirtsImg}
              active={activeCatalog === 't-shirts'}
            />

            {/* Sub-filters — animate in, disappear instantly */}
            {isExpanded && (
              <div className="tfa-group__subs">
                {SUB_TYPES.map(({type, label}, i) => (
                  <motion.div
                    key={type}
                    initial={{opacity: 0, x: -14, scale: 0.88}}
                    animate={{opacity: 1, x: 0, scale: 1}}
                    transition={{...SPRING, delay: i * 0.055}}
                  >
                    <TypeFilterAvatar
                      label={label}
                      type={type}
                      activeType={activeType}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div layout="position" transition={LAYOUT_TRANSITION} key="hoodies" style={{flexShrink: 0}}>
          <FilterAvatar
            label={t.filter_label_hoodies}
            url="hoodies"
            image={hoodiesImg}
            active={activeCatalog === 'hoodies'}
          />
        </motion.div>
        <motion.div layout="position" transition={LAYOUT_TRANSITION} key="accessories" style={{flexShrink: 0}}>
          <FilterAvatar
            label={t.filter_label_accessories}
            url="accessories"
            image={accessoriesImg}
            active={activeCatalog === 'accessories'}
          />
        </motion.div>
        <motion.div layout="position" transition={LAYOUT_TRANSITION} key="kids" style={{flexShrink: 0}}>
          <FilterAvatar
            label={t.filter_label_kids}
            url="kids"
            image={kidsImg}
            active={activeCatalog === 'kids'}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

const FilterAvatar = ({label, url, active, image}) => {
  const {language} = useLocale();
  const fullUrl = url ? `/${language}/catalog/${url}` : `/${language}/catalog`;
  return (
    <Link to={fullUrl} className="tfa-item">
      <div className={`tfa-ring${active ? ' tfa-ring--active' : ''}`}>
        <div className="tfa-inner">
          <img src={image} alt={label} />
        </div>
      </div>
      <span className={`tfa-label${active ? ' tfa-label--active' : ''}`}>
        {label}
      </span>
    </Link>
  );
};

const TypeFilterAvatar = ({label, type, activeType}) => {
  const {pathname, search} = useLocation();
  const params = new URLSearchParams(search);
  if (activeType === type) {
    params.delete('type');
  } else {
    params.set('type', type);
  }
  const qs = params.toString();
  const to = qs ? `${pathname}?${qs}` : pathname;
  const isActive = activeType === type;
  return (
    <Link to={to} className="tfa-item">
      <div className={`tfa-ring${isActive ? ' tfa-ring--active' : ''}`}>
        <div className="tfa-inner">
          <img src={TYPE_AVATARS[type]} alt={label} />
        </div>
      </div>
      <span className={`tfa-label${isActive ? ' tfa-label--active' : ''}`}>
        {label}
      </span>
    </Link>
  );
};
