import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file
import { PuffLoader } from 'react-spinners'; // Using react-spinners for loading animation
import { FaQuestionCircle, FaCog, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Importing icons for FAQ

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

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

  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button className={`toggle-button ${darkMode ? 'dark' : ''} top-right`} onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
      <img src="/logo.png" alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
      <h1 className="title">
        Fake News Detection
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
      {result && (
        <p>
          {result === 'Real News' ? <FaCheckCircle style={{ marginRight: '5px' }} /> : <FaTimesCircle style={{ marginRight: '5px' }} />}
          {result}
        </p>
      )}
      
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>History</h2>
        {history.map((item, index) => (
          <div key={index} className="history-card">
            <strong>Title:</strong> {item.title}<br />
            <strong>Content:</strong> {item.content}<br />
            <strong>Result:</strong> <span style={{ color: item.result === 'Real News' ? 'green' : 'red' }}>{item.result}</span>
          </div>
        ))}
      </div>
      <button onClick={toggleFAQ} style={{ marginTop: '20px' }}>
        {showFAQ ? 'Hide FAQ' : 'Show FAQ'}
      </button>
      {showFAQ && (
        <div className="faq-section" style={{ marginTop: '20px', textAlign: 'left', maxWidth: '600px' }}>
          <h2>FAQ</h2>
          <div>
            <h3><FaQuestionCircle style={{ marginRight: '5px' }} /> What is this app?</h3>
            <p>This app helps you verify whether a news article is fake or real.</p>
          </div>
          <div>
            <h3><FaCog style={{ marginRight: '5px' }} /> How does it work?</h3>
            <p>You paste the title and content of the article, and the app will analyze it to determine if it's fake or real.</p>
          </div>
          <div>
            <h3><FaCheckCircle style={{ marginRight: '5px' }} /> Is the verification accurate?</h3>
            <p>While the app uses advanced algorithms to verify news, no verification system is 100% accurate. Always use multiple sources to confirm the authenticity of news.</p>
          </div>
        </div>
      )}
      <footer style={{ marginTop: '40px', padding: '10px', borderTop: '1px solid #ccc', textAlign: 'center' }}>
        <p>&copy; 2024 Fake News Detection App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;