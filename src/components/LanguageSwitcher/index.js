import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

function LanguageSwitcher({ slug, allLocales, getColorForSelection }) {
  // to apply styles to language selection buttons
  let currentLang = '';
  for (let i = 0; i < allLocales.length; i += 1) {
    if (window.location.pathname.includes(allLocales[i].node.code)) {
      currentLang = allLocales[i].node.code;
    }
  }

  function applyColor() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('carouselIndex'), 10);
    for (let i = 0; i < allLocales.length; i += 1) {
      if (document.getElementById(`${allLocales[i].node.code}-text`) !== null
        && document.getElementById(`${allLocales[i].node.code}-text`).classList[1] === undefined) {
        document.getElementById(`${allLocales[i].node.code}-text`).className = `language text-${getColorForSelection(page)}`;
      }
    }
  }

  return (
    <div className="language-switcher">
      {allLocales.map(({ node }) => (
        <div style={{ zIndex: 300 }} key={node.code}>
          <Link to={`/${node.code}/${slug}/?state=selection`} state={{ prevLocale: currentLang }} key={`language-${node.code}`} draggable={false} onTouchStart={() => applyColor()}>
            <div className={`${currentLang === node.code ? 'lang-border3' : 'lang-border-blank'}`}>
              <div className={`${currentLang === node.code ? 'lang-border2' : 'lang-border-blank'}`}>
                <div className={`${currentLang === node.code ? 'lang-border1' : 'lang-border-blank'}`}>
                  <div className={`language ${currentLang === node.code ? 'selected' : ''}`} id={`${node.code}-text`}>
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
  getColorForSelection: PropTypes.func.isRequired,
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
