import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBot.css';
import companyLogo from './company-logo.png';
import botIcon from './bot-icon.png';
import { v4 as uuidv4 } from 'uuid';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { id: uuidv4(), text: 'Hello! How can I assist you today?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = { id: uuidv4(), text: inputValue, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);
    setError("");  

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/chat', {
        message: inputValue
      });

      const botMessage = { id: uuidv4(), text: response.data.response, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { id: uuidv4(), text: "Sorry, there was an error. Please try again.", sender: 'bot' }
      ]);
      setError("An error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setInputValue(""); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot">
      <div className="header">
        <img src={companyLogo} alt="Company Logo" className="company-logo" />
      </div>
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className={`message-container ${message.sender}`}>
            {message.sender === 'bot' && (
              <img src={botIcon} alt="Bot" className="bot-icon" />
            )}
            <div className={`message ${message.sender}`}>
              {message.text}
            </div>
          </div>
        ))}
        {loading && <div className="loading">...</div>}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="error">{error}</div>}
      <div className="input-section">
        <input
          type="text"
          className="input-box"
          placeholder="Type your question here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}  
        />
        <button className="send-button" onClick={handleSendMessage}>
          <span className="arrow">➤</span>
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
