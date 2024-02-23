/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { useIdleTimer } from 'react-idle-timer/legacy';
import VideoPlayer from '@components/VideoPlayer';
import Selection from '../../components/Selection';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export const pageQuery = graphql`

  fragment VideoSelectorFragment on ContentfulVideoSelector {
    slug
    node_locale
    titleDisplay
    inactivityDelay
    backgroundAsset {
      localFile {
        publicURL
      }
    }
    selections {
      titleDisplay,
      captionAsset {
        localFile {
          publicURL
        } 
      }
      videoAsset {
        localFile {
          publicURL
        }
      }
      thumbnail {
        localFile {
          publicURL
        }
      }
    }
  }

  query ($slug: String!, $locales: [String]!) {
      allContentfulLocale {
        edges {
          node {
            code
            default
            name
          }
        }
      }
      allContentfulVideoSelector (
        filter: {
          slug: { eq: $slug }
          node_locale: { in: $locales }
        }
      ) {
        edges {
          node {
            ...VideoSelectorFragment
          }
        }
      }
  }
`;

function VideoSelector(all) {
  const { data, pageContext } = all;

  // If only one locale is passed, create array with all other locales
  // This is used to create a language switcher
  let otherLocales = [];
  if (pageContext.locales.length === 1) {
    otherLocales = data.allContentfulLocale.edges.filter(
      ({ node }) => node.code !== pageContext.locales[0],
    );
  }

  const selectors = data.allContentfulVideoSelector.edges.map(({ node }) => node);

  // Get default locale code
  const defaultLocale = data.allContentfulLocale.edges.find(({ node }) => node.default).node.code;
  let defaultSelector = selectors.find((selector) => selector.node_locale === defaultLocale);
  if (!defaultSelector) {
    [defaultSelector] = selectors; // Default to first selector if default locale is not available
  }

  // Create array of localized content based on a specific selection field
  function getLocales(field, selectionIndex) {
    const locales = {};
    selectors.forEach((selector) => {
      locales[selector.node_locale] = selector.selections[selectionIndex][field];
    });
    return locales;
  }

  // Loads default (multi-lingual) selector after inactivity timeout
  const onIdle = () => {
    window.location = `${window.location.origin}/${defaultSelector.slug}`;
  };

  const { pause, reset } = useIdleTimer({
    onIdle,
    timeout: defaultSelector.inactivityDelay * 1000,
    throttle: 500,
  });

  // Loop over defaultSelector's selections to create selection objects
  // Mix in available locales as available
  const selections = defaultSelector.selections.map((selection, index) => {
    const selectionObject = {
      titleDisplay: selection.titleDisplay,
      titleDisplays: getLocales('titleDisplay', index),
      captionAsset: selection.captionAsset?.localFile.publicURL,
      captionAssets: getLocales('captionAsset', index),
      thumbnail: selection.thumbnail,
      thumbnails: getLocales('thumbnail', index),
      videoAsset: selection.videoAsset?.localFile.publicURL,
      videoAssets: getLocales('videoAsset', index),
    };
    return selectionObject;
  });

  // to use for initial state
  const blankSelection = {
    titleDisplay: selections[0].titleDisplay,
    titleDisplays: getLocales('titleDisplay', 0),
    captionAsset: '',
    captionAssets: getLocales('captionAsset', 0),
    thumbnail: selections[0].thumbnail,
    thumbnails: getLocales('thumbnail', 0),
    videoAsset: '',
    videoAssets: getLocales('videoAsset', 0),
  };

  const [currentSelection, setCurrentSelection] = useState(blankSelection);

  function setSelection(selection) {
    setCurrentSelection(selection);
    // Replay video on click if current selection hasn't changed.
    // (Only applicable when selections and video player are both visible)
    if (selection === currentSelection && selection.videoAsset) {
      document.getElementById('video').play();

      // Apply styles to hide list and show video
      const player = document.getElementById('player-wrapper');
      player.classList.remove('hide-player-wrapper');
      player.classList.add('show-player-wrapper');
      const selectionItems = document.getElementsByClassName('selection-item');
      Object.keys(selectionItems).forEach((i) => selectionItems[i].classList.add('hide-selection'));
    }
  }

  useEffect(() => {
    setSelection(currentSelection);
  }, [currentSelection]);

  const selectionItems = selections.map((i) => (
    <Selection
      key={i.titleDisplay}
      item={i}
      setSelection={setSelection}
    />
  ));

  return (
    <div className={`video-selector ${defaultSelector.slug}`}>
      <div
        className="graphic"
        style={{
          backgroundImage: `url(${defaultSelector.backgroundAsset
            ? defaultSelector.backgroundAsset.localFile.publicURL
            : null})`,
        }}
      />
      <div className="title-container">
        {selectors.map((selector) => (
          <h1 key={`title-${selector.node_locale}`} className={`title ${selector.node_locale}`}>
            {selector.titleDisplay}
          </h1>
        ))}
      </div>
      <div className="selection-container">{selectionItems}</div>
      <VideoPlayer currentSelection={currentSelection} pause={pause} reset={reset} />
      {otherLocales.length > 0 && (
        <LanguageSwitcher otherLocales={otherLocales} slug={defaultSelector.slug} />
      )}
    </div>
  );
}

export default VideoSelector;
