import React, { useState, useContext } from "react";
import "./ChatWidget.css";
import secureFetch from "../utils/api";
import { CartContext } from "../context/CartContext";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isCartMode, setIsCartMode] = useState(false);
  const [isOrdersMode, setIsOrdersMode] = useState(false);
  const { cartId } = useContext(CartContext);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleCartMode = () => {
    setIsCartMode(!isCartMode);
    if (isOrdersMode) setIsOrdersMode(false);
  };

  const toggleOrdersMode = () => {
    setIsOrdersMode(!isOrdersMode);
    if (isCartMode) setIsCartMode(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = { text: inputValue, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");

    try {
      let messageToSend = inputValue;
      if (isCartMode && cartId) {
        // messageToSend += ` (Cart ID: ${cartId})`;
        messageToSend += " Cart id is: 01f3f7ce-640b-41bf-8836-5621ea89db0a";
      } else if (isOrdersMode) {
        const token = localStorage.getItem("access_token");
        if (token) {
          // messageToSend += ` (JWT Token: ${token})`;
          messageToSend +=
            " JWT token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyMjQwODkyLCJpYXQiOjE3NjIxNTQ0OTIsImp0aSI6IjA3ZGRlZDdmN2UxMzRiYjRhMjc3ZTBiMTlhMGIyNzU3IiwidXNlcl9pZCI6MX0.WfRAxLJ9OKsOOMdAMrI6jYjIebhj1LTSPxGcg3N3hsE";
        }
        if (cartId) {
          // messageToSend += ` (Cart ID: ${cartId})`;
          messageToSend += " Cart id is: 01f3f7ce-640b-41bf-8836-5621ea89db0a";
        }
      }

      const response = await secureFetch("/assistant/chat/", {
        method: "POST",
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from the assistant.");
      }

      const data = await response.json();
      const assistantMessage = { text: data.reply, sender: "assistant" };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error communicating with the assistant:", error);
      const errorMessage = {
        text: "Sorry, something went wrong. Please try again.",
        sender: "assistant",
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
            <button
              onClick={toggleCartMode}
              className="cart-mode-toggle-button"
            >
              {isCartMode ? "Exit Cart Mode" : "Enter Cart Mode"}
            </button>
            <button
              onClick={toggleOrdersMode}
              className="orders-mode-toggle-button"
            >
              {isOrdersMode ? "Exit Orders Mode" : "Enter Orders Mode"}
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
              placeholder={
                isCartMode
                  ? "e.g., add 2 shoes to cart"
                  : isOrdersMode
                    ? "e.g., what is the status of my last order?"
                    : "Type your message..."
              }
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
