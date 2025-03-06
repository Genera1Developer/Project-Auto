function ErrorDisplay({ message }) {
  return (
    <div className="error-display">
      <p className="error-message">{message || "An unknown error occurred."}</p>
    </div>
  );
}

export default ErrorDisplay;