/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { useIdleTimer } from 'react-idle-timer';
import VideoPlayer from '@components/VideoPlayer';
import Menu from '@components/Menu';
import { SwiperSlide } from 'swiper/react';
import { v4 as uuidv4 } from 'uuid';
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
    soundAssets {
      modalNo
      modalYes
      pageSelection
      attractExit
      languageChange
      videoSelection
    }
    attractLogo
    attractPlaylist
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
      narrationAsset{
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
  const { data, pageContext, location } = all;
  // If only one locale is passed, create array with all other locales
  // This is used to create a language switcher
  let otherLocales = [];
  if (pageContext.locales.length === 1) {
    otherLocales = data.allContentfulLocale.edges.filter(
      ({ node }) => node.code !== pageContext.locales[0],
    );
  }

  const selectors = data.allContentfulVideoSelector.edges.map(({ node }) => node);
  const allLocales = data.allContentfulLocale.edges;

  // Get default locale code
  const defaultLocale = data.allContentfulLocale.edges.find(({ node }) => node.default).node.code;
  let defaultSelector = selectors.find((selector) => selector.node_locale === defaultLocale);
  if (!defaultSelector) {
    [defaultSelector] = selectors; // Default to first selector if default locale is not available
  }

  const { attractPlaylist, soundAssets } = defaultSelector;

  // Create a pool of videos for random selection
  const attractVideoPool = defaultSelector.selections.map(
    (selection) => selection.videoAsset.localFile.publicURL,
  );

  // Create array of localized content based on a specific selection field
  function getLocales(field, selectionIndex) {
    const locales = {};
    selectors.forEach((selector) => {
      locales[selector.node_locale] = selector.selections[selectionIndex][field];
    });
    return locales;
  }

  const onIdle = () => {
    if (typeof window !== 'undefined') {
      const route = `${window.location.origin}/${defaultLocale}/${defaultSelector.slug}`;
      window.location.href = route;
    }
  };

  const { reset, pause } = useIdleTimer({
    onIdle,
    timeout: 1000 * defaultSelector.inactivityDelay,
  });

  // Loop over defaultSelector's selections to create selection objects
  // Mix in available locales as available
  const selections = defaultSelector.selections.map((selection, index) => {
    const selectionObject = {
      titleDisplay: selection.titleDisplay,
      titleDisplays: getLocales('titleDisplay', index),
      captionAsset: selection.captionAsset?.localFile.publicURL,
      captionAssets: getLocales('captionAsset', index),
      narrationAsset: selection.narrationAsset?.localFile.publicURL,
      narrationAssets: getLocales('narrationAsset', index),
      thumbnail: selection.thumbnail,
      thumbnails: getLocales('thumbnail', index),
      videoAsset: selection.videoAsset?.localFile.publicURL,
      videoAssets: getLocales('videoAsset', index),
      sound: soundAssets.videoSelection,
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
    sound: '',
  };

  const [currentSelection, setCurrentSelection] = useState(blankSelection);
  const [modalSel, setModalSel] = useState('');

  const [videoShow, setVideoShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  let skipAttract = false;
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');

    const incomingState = location.state;
    if (incomingState
      && incomingState.prevLocale !== defaultSelector.node_locale
      && modalSel === ''
      && !modalShow
      && !videoShow) {
      // If we're here, it means the language has changed
      const eventData = {
        locale: defaultSelector.node_locale,
      };
      logger.log(logger.EVENTS.LANGUAGE_CHANGE, eventData);
      // Load and play a sound effect
      const languageSound = new Audio(soundAssets.languageChange);
      languageSound.play().catch((error) => {
        console.log('Could not play sound:', error);
      });
    }

    if (state === 'selection') {
      skipAttract = true;
      reset(); // Reset idle timer
    }
  }

  // To apply background and text selection color transitions
  function getColorForSelection(selectionNumber) {
    const colors = ['orange', 'red', 'pink', 'purple'];
    const colorIndex = Math.floor(selectionNumber / 4) % colors.length;
    return colors[colorIndex];
  }

  function loadTextColor(prevPage, nextPage) {
    // select color on load
    if (prevPage === null || prevPage === nextPage) {
      for (let i = 0; i < allLocales.length; i += 1) {
        if (document.getElementById(`${allLocales[i].node.code}-text`) !== null
        && document.getElementById(`${allLocales[i].node.code}-text`).className.includes('selected')) {
          document.getElementById(`${allLocales[i].node.code}-text`).className = `language selected text-${getColorForSelection(nextPage)}`;
        }
      }
    }
    // select color on swipe
    if (prevPage !== null) {
      for (let i = 0; i < allLocales.length; i += 1) {
        if (document.getElementById(`${allLocales[i].node.code}-text`) !== null
          && document.getElementById(`${allLocales[i].node.code}-text`).className.includes('selected')) {
          document.getElementById(`${allLocales[i].node.code}-text`).className = `language selected text-${getColorForSelection(prevPage)}-to-${getColorForSelection(nextPage)}`;
        }
      }
    }
  }

  // Display states
  const [menuShow, setMenuShow] = useState(skipAttract);

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

  const setUrlParam = (key, value) => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const currentPage = parseInt(urlParams.get('carouselIndex'), 10);

      // Set background and selected language colors
      if (typeof value !== 'number') {
        document.getElementById('bgRef').className = `bg bg-${getColorForSelection(currentPage)}`;
        loadTextColor(null, currentPage);
      }
      if (typeof value === 'number') {
        document.getElementById('bgRef').className = `bg bg-${getColorForSelection(currentPage)}-to-${getColorForSelection(value)}`;
        loadTextColor(currentPage, value);
      }

      urlParams.set(key, value);
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState(null, null, newUrl);
    }
  };

  const onSlideChange = (swiper) => {
    if (typeof window !== 'undefined') {
      const { realIndex } = swiper;
      setUrlParam('carouselIndex', realIndex);
    }
  };

  useEffect(() => {
    if (modalSel === 'yes') {
      const eventData = {
        videoTitle: currentSelection.titleDisplay,
        locale: defaultSelector.node_locale,
      };
      logger.log(logger.EVENTS.VIDEO_START, eventData);
      setSelection(currentSelection);
    }
    if (menuShow) {
      setUrlParam('state', 'selection');
    }
  }, [currentSelection, modalSel, videoShow, menuShow]);

  const blankEntry = {
    titleDisplay: '',
    captionAsset: '',
    narrationAsset: '',
    videoAsset: '',
    thumbnail: '',
  };

  // Add empty hexes if page is not full
  function addBlankEntries(num) {
    const entriesNeeded = Math.ceil(num / 4) * 4;
    const entriesToAdd = entriesNeeded - num;
    for (let i = 0; i < entriesToAdd; i += 1) {
      selections.push(blankEntry);
    }
    return selections;
  }

  addBlankEntries(selections.length);

  const selectionItems = selections.map((i, index) => (
    <SwiperSlide key={uuidv4()} className={index % 2 === 0 ? 'slide bottom-slide' : 'slide'}>
      <Selection
        key={i.titleDisplay}
        item={i}
        setCurrentSelection={setCurrentSelection}
        setModalShow={setModalShow}
        menuShow={menuShow}
        sound={i.sound}
      />
    </SwiperSlide>
  ));

  let initialSlide = 0;
  if (defaultSelector.randomizeSelections) {
    initialSlide = Math.floor(Math.random() * selections.length);
  }

  return (
    <div className={`video-selector ${defaultSelector.slug}`}>
      <div id="bgRef" className="bg">
        {menuShow && (
          <Menu
            selectionItems={selectionItems}
            initialSlide={initialSlide}
            onSlideChange={onSlideChange}
            sound={soundAssets.pageSelection}
          />
        )}
        <SelectModal
          setModalSel={setModalSel}
          setModalShow={setModalShow}
          modalShow={modalShow}
          setVideoShow={setVideoShow}
          setMenuShow={setMenuShow}
          currentSelection={currentSelection}
          noSound={soundAssets.modalNo}
          yesSound={soundAssets.modalYes}
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
          playlist={attractPlaylist}
          videoPool={attractVideoPool}
          attractLogo={defaultSelector.attractLogo}
          sound={soundAssets.attractExit}
        />
        {otherLocales.length > 0 && menuShow && (
        <LanguageSwitcher
          allLocales={allLocales}
          otherLocales={otherLocales}
          slug={defaultSelector.slug}
        />
        )}
      </div>
    </div>
  );
}

export default VideoSelector;
