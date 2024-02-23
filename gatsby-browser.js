/* eslint-disable import/prefer-default-export */
/* eslint-disable react/function-component-definition */
// Don't require a default export. Gatsby's API can't support it here.
import PropTypes from 'prop-types';
import './src/styles/index.css';
import '@fontsource/open-sans';

export const wrapRootElement = ({ element }) => element;

wrapRootElement.propTypes = {
  element: PropTypes.element.isRequired,
};
