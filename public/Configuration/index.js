import React, { useState, useEffect } from 'react';
 import { useAuth } from '../AuthContext';
 import './style.css';

 const Configuration = () => {
  const { accessToken } = useAuth();
  const [repo, setRepo] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(new Date());
  const [output, setOutput] = useState('');

  useEffect(() => {
  const intervalId = setInterval(() => {
  setTime(new Date());
  }, 1000);

  return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsRunning(true);
  setOutput(''); // Clear previous output

  try {
  const response = await fetch('/api/run-auto', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({ repo, prompt }),
  });

  if (!response.ok) {
  const errorData = await response.json();
  throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
  }

  // Use ReadableStream to handle streaming output
  const reader = response.body.getReader();
  let decoder = new TextDecoder();
  let accumulatedData = '';

  while (true) {
  const { done, value } = await reader.read();

  if (done) {
  break;
  }

  accumulatedData += decoder.decode(value);
  setOutput(prevOutput => prevOutput + accumulatedData); // Append new data
  }

  console.log('Project Auto Result: Stream completed');

  } catch (error) {
  console.error('Error running Project Auto:', error);
  setOutput(prevOutput => prevOutput + `\nError: ${error.message}`);
  } finally {
  setIsRunning(false);
  }
  };

  return (
  <div className="configuration-container">
  <div className="top-bar">
  <span className="time">{time.toLocaleTimeString()}</span>
  </div>
  <h1>Project Auto Configuration</h1>
  <form onSubmit={handleSubmit}>
  <div className="form-group">
  <label htmlFor="repo">GitHub Repository (username/repo):</label>
  <input
  type="text"
  id="repo"
  value={repo}
  onChange={(e) => setRepo(e.target.value)}
  placeholder="e.g., owner/repository"
  required
  />
  </div>
  <div className="form-group">
  <label htmlFor="prompt">Customization Instructions:</label>
  <textarea
  id="prompt"
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  placeholder="Enter your instructions here..."
  required
  />
  </div>
  <button type="submit" disabled={isRunning}>
  {isRunning ? 'Running...' : 'Start'}
  </button>
  </form>
  <div className="output-container">
  <label>Output:</label>
  <pre>{output}</pre>
  </div>
  </div>
  );
 };

 export default Configuration;