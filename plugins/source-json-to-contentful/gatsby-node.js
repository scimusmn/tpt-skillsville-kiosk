/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const jsonData = require('../../static/main.json');

  const { globalSettings, locales } = jsonData;
  const defaultLocaleCode = locales.find((locale) => locale.default).code;

  const localeData = {};
  locales.forEach((locale) => {
    localeData[locale.code] = require(`../../static/${locale.contentFile}`);
  });

  const defaultData = localeData[defaultLocaleCode];

  const createLocaleNode = (locale) => {
    const transformedData = {
      code: locale.code,
      name: locale.name,
      default: locale.default,
    };

    const node = {
      ...transformedData,
      id: createNodeId(transformedData.code),
      internal: {
        type: 'ContentfulLocale',
        contentDigest: createContentDigest(transformedData),
      },
    };

    actions.createNode(node);
  };

  // Create Contentful locale nodes in data layer
  locales.forEach(createLocaleNode);

  const createVideoSelectorNode = ([code, data]) => {
    const transformedData = {
      slug: globalSettings.id || 'video-selector',
      node_locale: code,
      inactivityDelay: globalSettings.inactivityTimeout,
      titleDisplay: data.titleDisplay || defaultData.titleDisplay,
      backgroundAsset: {
        localFile: {
          publicURL: data.backgroundAsset || defaultData.backgroundAsset,
        },
      },
      selections: data.videoSelections.map((selection, index) => ({
        titleDisplay: selection.titleDisplay
        || defaultData.videoSelections[index].titleDisplay,
        captionAsset: {
          localFile: {
            publicURL: selection.captionAsset
            || defaultData.videoSelections[index].captionAsset,
          },
        },
        narrationAsset: {
          localFile: {
            publicURL: selection.narrationAsset
            || defaultData.videoSelections[index].narrationAsset,
          },
        },
        videoAsset: {
          localFile: {
            publicURL: selection.videoAsset
            || defaultData.videoSelections[index].videoAsset,
          },
        },
        thumbnail: {
          localFile: {
            publicURL: selection.thumbnail
            || defaultData.videoSelections[index].thumbnail,
          },
        },
      })),
    };

    const node = {
      ...transformedData,
      id: createNodeId(`${transformedData.slug}-${code}`),
      internal: {
        type: 'ContentfulVideoSelector',
        contentDigest: createContentDigest(transformedData),
      },
    };

    actions.createNode(node);
  };

  // Create Contentful video selector nodes in data layer
  Object.entries(localeData).forEach(createVideoSelectorNode);
};
