import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file
import { PuffLoader } from 'react-spinners'; // Using react-spinners for loading animation

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content cannot be empty.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/verify/', { title, content });
      const verificationResult = response.data.is_fake ? 'Fake News' : 'Real News';
      setResult(verificationResult);
      setHistory([...history, { title, content, result: verificationResult }]);
    } catch (error) {
      setError('An error occurred while verifying the news.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTitle('');
    setContent('');
    setResult(null);
    setError(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button className={`toggle-button ${darkMode ? 'dark' : ''} top-right`} onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
      <img src="/logo.png" alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
      <h1 className="title">
        Fake News Verification
      </h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-box focused-input"
        />
        <textarea
          placeholder="Paste article text here"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-box focused-input"
        />
        <button type="submit" className="verify-button" title="Click to verify the article">
          Verify
        </button>
        <button type="button" onClick={handleClear} className="clear-button" title="Click to clear the input fields">
          Clear
        </button>
      </form>
      {loading && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}><PuffLoader color="#4caf50" size={60} /></div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <p>{result}</p>}
      
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>History</h2>
        <div className="history-container">
          {history.map((item, index) => (
            <div key={index} className="history-card">
              <strong>Title:</strong> {item.title}<br />
              <strong>Content:</strong> {item.content}<br />
              <strong>Result:</strong> {item.result}
            </div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '40px', padding: '10px', borderTop: '1px solid #ccc', textAlign: 'center' }}>
        <p>&copy; 2024 Fake News Verification App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;