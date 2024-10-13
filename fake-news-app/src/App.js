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
    <div className="App p-5 font-sans flex flex-col items-center">
      <button className={`toggle-button ${darkMode ? 'dark' : ''} top-right`} onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
      <h1 className="title text-gray-800 text-4xl font-bold mb-5">
        Fake News Detection
      </h1>
      <form onSubmit={handleSubmit} className="mb-5 text-center">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-box focused-input border p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Paste article text here"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-box focused-input border p-2 mb-2 w-full"
        />
        <button type="submit" className="verify-button bg-blue-500 text-white p-2 rounded" title="Click to verify the article">
          Verify
        </button>
        <button type="button" onClick={handleClear} className="clear-button bg-red-500 text-white p-2 rounded ml-2" title="Click to clear the input fields">
          Clear
        </button>
      </form>
      {loading && <div className="flex justify-center items-center h-24"><PuffLoader color="#4caf50" size={60} /></div>}
      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <p className="text-lg">
          {result === 'Real News' ? <FaCheckCircle className="inline mr-1" /> : <FaTimesCircle className="inline mr-1" />}
          {result}
        </p>
      )}
      
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold">History</h2>
        {history.map((item, index) => (
          <div key={index} className="history-card border p-3 mb-2">
            <strong>Title:</strong> {item.title}<br />
            <strong>Content:</strong> {item.content}<br />
            <strong>Result:</strong> <span className={item.result === 'Real News' ? 'text-green-500' : 'text-red-500'}>{item.result}</span>
          </div>
        ))}
      </div>
      <button onClick={toggleFAQ} className="mt-5 bg-gray-500 text-white p-2 rounded">
        {showFAQ ? 'Hide FAQ' : 'Show FAQ'}
      </button>
      {showFAQ && (
        <div className="faq-section mt-5 text-left max-w-xl">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <div>
            <h3 className="text-xl font-semibold"><FaQuestionCircle className="inline mr-1" /> What is this app?</h3>
            <p>This app helps you verify whether a news article is fake or real.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold"><FaCog className="inline mr-1" /> How does it work?</h3>
            <p>You paste the title and content of the article, and the app will analyze it to determine if it's fake or real.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold"><FaCheckCircle className="inline mr-1" /> Is the verification accurate?</h3>
            <p>While the app uses advanced algorithms to verify news, no verification system is 100% accurate. Always use multiple sources to confirm the authenticity of news.</p>
          </div>
        </div>
      )}
      <footer className="mt-10 p-3 border-t text-center">
        <p>&copy; 2024 Fake News Detection App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;