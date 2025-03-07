function ErrorDisplay({ errorMessage }) {
  if (!errorMessage) {
    return null;
  }

  return (
    <div className="error-display">
      <h2>Error</h2>
      <p>{errorMessage}</p>
    </div>
  );
}

export default ErrorDisplay;