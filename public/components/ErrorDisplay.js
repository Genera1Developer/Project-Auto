import React from 'react';
import PropTypes from 'prop-types';

function ErrorDisplay({ message }) {
  return (
    <div className="error-display" role="alert">
      <p className="error-message">{message || "An unknown error occurred."}</p>
    </div>
  );
}

ErrorDisplay.propTypes = {
  message: PropTypes.string,
};

export default ErrorDisplay;