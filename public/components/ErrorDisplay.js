function ErrorDisplay({ message }) {
  return (
    <div className="error-display">
      <p className="error-message">{message}</p>
    </div>
  );
}

export default ErrorDisplay;