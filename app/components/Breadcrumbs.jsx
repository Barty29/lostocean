import {Link} from 'react-router';
import {useLocale} from '~/hooks/useLocale';

const Breadcrumbs = ({links = []}) => {
  const {language} = useLocale();

  return (
    <nav style={{display: 'flex', gap: '8px'}} className="breadcrumbs">
      {links.map((item, index) => {
        const isLast = index === links.length - 1;
        const label = language === 'sk' ? item.labelSk : item.label;

        return (
          <span key={item.to} style={{display: 'flex', gap: '8px'}}>
            {isLast ? (
              <span style={{opacity: 1}}>{label}</span>
            ) : (
              <Link to={item.to}>{label}</Link>
            )}

            {!isLast && <span>/</span>}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
