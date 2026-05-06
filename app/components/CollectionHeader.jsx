import Breadcrumbs from '~/components/Breadcrumbs';
import './CollectionHeader.css';

/**
 * Page header for catalog / collection pages.
 *
 * Props:
 *   title        — heading text
 *   description  — optional subtitle text
 *   breadcrumbs  — optional array of { label, labelSk, to } passed to <Breadcrumbs />
 */
export default function CollectionHeader({title, description, breadcrumbs}) {
  return (
    <div className="collection-header">
      <div className="collection-header__content">
        {breadcrumbs && <Breadcrumbs links={breadcrumbs} />}
        {/* <h2 className="np__title">{title}</h2> */}
        <h1
          style={{fontSize: '56px', textTransform: 'none'}}
          className="np__title"
        >
          {title}
        </h1>
        {description && (
          <p className="collection-header__desc">{description}</p>
        )}
      </div>
    </div>
  );
}
