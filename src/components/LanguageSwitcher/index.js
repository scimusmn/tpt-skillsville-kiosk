import React from 'react';
import PropTypes from 'prop-types';

function LanguageSwitcher({ otherLocales, slug }) {
  return (
    <div className="language-switcher">
      {/* <h2>Language</h2> */}
      <div>
        {otherLocales.map(({ node }) => (
          <span key={`language-${node.code}`} className={`language ${node.code}`}>
            <a href={`/${node.code}/${slug}`}>
              {node.name}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}

LanguageSwitcher.propTypes = {
  otherLocales: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        code: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
  slug: PropTypes.string.isRequired,
};

export default LanguageSwitcher;
