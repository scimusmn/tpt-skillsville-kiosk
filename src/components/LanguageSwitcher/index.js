import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

function LanguageSwitcher({ slug, allLocales }) {
  // to apply styles to language selection buttons
  let currentLang = '';
  for (let i = 0; i < allLocales.length; i += 1) {
    if (window.location.pathname.includes(allLocales[i].node.code)) {
      currentLang = allLocales[i].node.code;
    }
  }

  return (
    <div className="language-switcher">
      {allLocales.map(({ node }) => (
        <div style={{ zIndex: 300 }}>
          <Link to={`/${node.code}/${slug}/?state=selection`} key={`language-${node.code}`}>
            <div className={`${currentLang === node.code ? 'lang-border3' : 'lang-border-blank'}`}>
              <div className={`${currentLang === node.code ? 'lang-border2' : 'lang-border-blank'}`}>
                <div className={`${currentLang === node.code ? 'lang-border1' : 'lang-border-blank'}`}>
                  <div className={`language ${currentLang === node.code ? 'selected' : ''}`}>
                    {node.name}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
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
