import React from 'react';
import PropTypes from 'prop-types';

function ErrorDisplay({ message }) {
  return (
    <div className="error-display" style={{
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #f5c6cb',
      borderRadius: '5px',
    }}>
      <p className="error-message" style={{ margin: 0 }}>{message || "An unknown error occurred."}</p>
    </div>
  );
}

ErrorDisplay.propTypes = {
  message: PropTypes.string,
};

export default ErrorDisplay;