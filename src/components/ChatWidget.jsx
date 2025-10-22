
import React, { useState, useContext } from 'react';
import './ChatWidget.css';
import secureFetch from '../utils/api';
import { CartContext } from '../context/CartContext';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isCartMode, setIsCartMode] = useState(false);
  const { cartId } = useContext(CartContext);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleCartMode = () => {
    setIsCartMode(!isCartMode);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');

    try {
      const headers = {};
      if (isCartMode && cartId) {
        headers['X-Cart-ID'] = cartId;
      }

      const response = await secureFetch('/assistant/chat/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the assistant.');
      }

      const data = await response.json();
      const assistantMessage = { text: data.reply, sender: 'assistant' };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error communicating with the assistant:', error);
      const errorMessage = {
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'assistant',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="chat-widget-container">
      <button className="chat-widget-toggle-button" onClick={toggleChat}>
        Chat
      </button>
      {isOpen && (
        <div className="chat-widget-window">
          <div className="chat-widget-header">
            <h2>Chat with our assistant</h2>
            <button onClick={toggleCartMode} className="cart-mode-toggle-button">
              {isCartMode ? 'Exit Cart Mode' : 'Enter Cart Mode'}
            </button>
          </div>
          <div className="chat-widget-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-widget-message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-widget-input">
            <input
              type="text"
              placeholder={isCartMode ? 'e.g., add 2 shoes to cart' : 'Type your message...'}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
