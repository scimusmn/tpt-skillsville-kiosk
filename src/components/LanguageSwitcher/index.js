import React from 'react';
import PropTypes from 'prop-types';

function LanguageSwitcher({ slug, allLocales }) {
  return (
    <div className="language-switcher">
      <div>
        {allLocales.map(({ node }) => (
          <span key={`language-${node.code}`} className={`language ${node.code}`}>
            <a href={`/${node.code}/${slug}`}>
              {node.name}
            </a>
          </span>
        ))}
        {/* For testing more languages */}
        {/* <span key="es" className="language es">
          <a href={`/es/${slug}`}>
            Hmong
          </a>
        </span>
        <span key="es" className="language es">
          <a href={`/es/${slug}`}>
            Somali
          </a>
        </span> */}
      </div>
    </div>
  );
}

LanguageSwitcher.propTypes = {
  slug: PropTypes.string.isRequired,
  allLocales: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        code: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
};

export default LanguageSwitcher;
