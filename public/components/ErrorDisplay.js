import React from 'react';
import PropTypes from 'prop-types';

function ErrorDisplay({ message }) {
  return (
    <div className="error-display">
      <p className="error-message">{message || "An unknown error occurred."}</p>
    </div>
  );
}

ErrorDisplay.propTypes = {
  message: PropTypes.string,
};

export default ErrorDisplay;