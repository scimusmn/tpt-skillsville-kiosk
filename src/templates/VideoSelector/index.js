/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { useIdleTimer } from 'react-idle-timer/legacy';
import VideoPlayer from '@components/VideoPlayer';
import Menu from '@components/Menu';
import { SwiperSlide } from 'swiper/react';
import AttractScreen from '../../components/AttractScreen';
import Selection from '../../components/Selection';
import SelectModal from '../../components/SelectModal';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import logger from '../../utils/Logger';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const pageQuery = graphql`

  fragment VideoSelectorFragment on ContentfulVideoSelector {
    slug
    node_locale
    titleDisplay
    inactivityDelay
    randomizeSelections
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

  // Loads default selector (all languages) after inactivity timeout
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
  const [modalSel, setModalSel] = useState('');

  // Display states
  const [menuShow, setMenuShow] = useState(false);
  const [videoShow, setVideoShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  function setSelection(selection) {
    setCurrentSelection(selection);
    // Replay video on click if current selection hasn't changed.
    // (Only applicable when selections and video player are both visible)
    if (selection === currentSelection && selection.videoAsset) {
      document.getElementById('video').play();
      // Set display states
      setVideoShow(true);
      setMenuShow(false);
    }
  }

  useEffect(() => {
    if (modalSel === 'yes') {
      logger.log('video-selection', currentSelection.titleDisplay);
      setSelection(currentSelection);
    }
  }, [currentSelection, modalSel, videoShow]);

  const selectionItems = selections.map((i, index) => (
    <SwiperSlide className={index % 2 === 0 ? 'bottom-slide' : 'top-slide'}>
      {index}
      <Selection
        key={i.titleDisplay}
        item={i}
        setCurrentSelection={setCurrentSelection}
        setModalShow={setModalShow}
        menuShow={menuShow}
      />
    </SwiperSlide>
  ));

  let initialSlide = 0;
  if (defaultSelector.randomizeSelections) {
    initialSlide = Math.floor(Math.random() * selections.length);
  }

  return (
    <div className={`video-selector ${defaultSelector.slug}`}>
      {menuShow && <Menu selectionItems={selectionItems} initialSlide={initialSlide} />}
      <SelectModal
        setModalSel={setModalSel}
        setModalShow={setModalShow}
        modalShow={modalShow}
        setVideoShow={setVideoShow}
        setMenuShow={setMenuShow}
      />
      <VideoPlayer
        currentSelection={currentSelection}
        pause={pause}
        reset={reset}
        setModalSel={setModalSel}
        modalShow={modalShow}
        videoShow={videoShow}
        setVideoShow={setVideoShow}
        setMenuShow={setMenuShow}
      />
      <AttractScreen
        pause={pause}
        reset={reset}
        menuShow={menuShow}
        setMenuShow={setMenuShow}
        videoShow={videoShow}
      />
      {otherLocales.length > 0 && menuShow && (
        <LanguageSwitcher
          otherLocales={otherLocales}
          slug={defaultSelector.slug}
        />
      )}
    </div>
  );
}

export default VideoSelector;
