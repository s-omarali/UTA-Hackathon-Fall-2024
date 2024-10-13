import React, { useState } from 'react';
import axios from 'axios';
import { PuffLoader } from 'react-spinners';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showFAQ, setShowFAQ] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleFAQ = () => setShowFAQ(!showFAQ);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    try {
      const response = await axios.post('http://localhost:8000/classify/', { text: content });
      setResult(response.data.result);
      setHistory([...history, { title, content, result: response.data.result }]);
    } catch (error) {
      console.error('Error classifying text:', error);
      setError('Error classifying text');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTitle('');
    setContent('');
    setResult('');
    setError('');
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <button className={`toggle-button ${darkMode ? 'dark' : ''} top-right`} onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
      <img src="/logo.png" alt="Logo" className="w-36 mb-5" />
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
          {result === 'True News' ? <FaCheckCircle className="inline mr-1" /> : <FaTimesCircle className="inline mr-1" />}
          {result}
        </p>
      )}
      
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold">History</h2>
        {history.map((item, index) => (
          <div key={index} className="history-card border p-3 mb-2">
            <strong>Title:</strong> {item.title}<br />
            <strong>Content:</strong> {item.content}<br />
            <strong>Result:</strong> <span className={item.result === 'True News' ? 'text-green-500' : 'text-red-500'}>{item.result}</span>
          </div>
        ))}
      </div>
      <button onClick={toggleFAQ} className="mt-5 bg-gray-500 text-white p-2 rounded">
        {showFAQ ? 'Hide FAQ' : 'Show FAQ'}
      </button>
      {showFAQ && (
        <div className="faq-section mt-5 text-left max-w-xl">
          <h2 className="text-2xl font-bold">FAQ</h2>
          {/* Add FAQ content here */}
        </div>
      )}
    </div>
  );
}

export default App;