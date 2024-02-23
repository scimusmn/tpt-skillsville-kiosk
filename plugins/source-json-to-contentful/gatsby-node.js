exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  // eslint-disable-next-line global-require, import/no-unresolved
  const jsonData = require('../../static/content.json');

  // Transform Locales from JSON into Contentful structure
  jsonData.locales.forEach((locale) => {
    const transformedData = {
      code: locale.code,
      name: locale.name,
      default: locale.default,
    };

    const node = {
      ...transformedData,
      // Required fields
      id: createNodeId(transformedData.code),
      internal: {
        type: 'ContentfulLocale',
        contentDigest: createContentDigest(transformedData),
      },
    };

    actions.createNode(node);
  });

  // Get default locale code
  const defaultLocale = jsonData.locales.find((locale) => locale.default).code;

  function getLocalized(fieldValue, localeCode) {
    // Return the value as-is if it's not a locale object
    if (typeof fieldValue !== 'object') {
      return fieldValue;
    }
    // If it's an object with locale keys, return the value for requested locale
    if (fieldValue[localeCode]) {
      return fieldValue[localeCode];
    }
    // If the requested locale doesn't exist, fall back to default locale value
    if (fieldValue[defaultLocale]) {
      return fieldValue[defaultLocale];
    }
    console.warn(`Unable to localize field value ${localeCode} - ${fieldValue}`);
    return null;
  }

  // Transform Video Selectors from JSON into Contentful structure
  jsonData.videoSelectors.forEach((selector, index) => {
    // Create one node per locale (to match Contentful's locale structure)
    // These locale nodes are merged in front-end queries
    jsonData.locales.forEach((locale) => {
      const transformedData = {
        slug: selector.slug || `video-selector-${index + 1}`, // If no slug is provided, use a default
        node_locale: locale.code,
        inactivityDelay: selector.inactivityTimeout,
        titleDisplay: getLocalized(selector.titleDisplay, locale.code),
        backgroundAsset: {
          localFile: {
            publicURL: selector.backgroundAsset,
          },
        },
        selections: selector.selections.map((selection) => ({
          titleDisplay: getLocalized(selection.titleDisplay, locale.code),
          captionAsset: {
            localFile: {
              publicURL: getLocalized(selection.captionAsset, locale.code),
            },
          },
          videoAsset: {
            localFile: {
              publicURL: selection.videoAsset,
            },
          },
          thumbnail: {
            localFile: {
              publicURL: selection.thumbnail,
            },
          },
        })),
      };

      const node = {
        ...transformedData,
        // Required fields
        id: createNodeId(`${transformedData.slug}-${locale.code}`),
        internal: {
          type: 'ContentfulVideoSelector',
          contentDigest: createContentDigest(transformedData),
        },
      };

      actions.createNode(node);
    });
  });
};
