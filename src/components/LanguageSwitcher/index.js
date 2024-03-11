import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

function LanguageSwitcher({ slug, allLocales }) {
  return (
    <div className="language-switcher">
      <div>
        {allLocales.map(({ node }) => (
          <Link to={`/${node.code}/${slug}/?state=selection`} key={`language-${node.code}`}>
            <span className={`language ${node.code}`}>
              {node.name}
            </span>
          </Link>
        ))}
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
