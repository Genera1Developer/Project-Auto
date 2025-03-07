function ErrorDisplay({ errorMessage }) {
  if (!errorMessage) {
    return null;
  }

  return (
    <div className="error-display" style={{ color: 'red', border: '1px solid red', padding: '10px', margin: '10px', backgroundColor: '#ffe6e6' }}>
      <h2>Error</h2>
      <p>{errorMessage}</p>
    </div>
  );
}

export default ErrorDisplay;