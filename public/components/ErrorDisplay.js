function ErrorDisplay({ errorMessage }) {
  if (!errorMessage) {
    return null;
  }

  return (
    
      <h2>Error</h2>
      <p>{errorMessage}</p>
    
  );
}

export default ErrorDisplay;