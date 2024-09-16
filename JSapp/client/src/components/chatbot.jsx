import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineMessage, AiOutlineClose, AiOutlineSend } from 'react-icons/ai';
import './Chatbot.css';
import axios from 'axios'; // To make API calls

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const chatBodyRef = useRef(null);

  // Scroll chat window to bottom whenever messages are updated
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChatbot = () => setIsOpen(!isOpen);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    setInputMessage('');  // Clear the input
    if (inputMessage.trim()) {
      const userMessage = { sender: 'user', text: inputMessage };
      setMessages([...messages, userMessage]);

      try {
        // Make a request to the Flask backend (localhost or hosted URL)
        const response = await axios.post('http://localhost:5000/api/chat', {

          message: inputMessage,
        });

        // Get the bot's reply and update the messages
        const botReply = { sender: 'bot', text: response.data.response };
        console.log(botReply)
        setMessages((prevMessages) => [...prevMessages, botReply]);

      } catch (error) {
        const botError = { sender: 'bot', text: 'Error occurred while fetching response!' };
        setMessages((prevMessages) => [...prevMessages, botError]);
      }

      
    }
  };

  const handleClickDefaultQuestion = (question) => {
    setInputMessage(question);
    handleSendMessage();
  };

  const defaultQuestions = [
    'What services do you offer?',
    'How can I upload documents?',
    'How do I verify my identity?',
  ];


  return (
    <div className='chat-container'>
      {!isOpen ? (
        <div className="chat-icon" onClick={toggleChatbot}>
          <AiOutlineMessage size={40} />
        </div>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <h2>PRAVAH Bot Assistant</h2>
            <AiOutlineClose size={24} onClick={toggleChatbot} className="close-btn" />
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          {/* <div className="default-questions">
            {defaultQuestions.map((question, index) => (
              <button
                key={index}
                className="default-question-btn"
                onClick={() => handleClickDefaultQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div> */}
          <div className="chat-input-container">
          <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="chat-input"
            />
            <button className="send-btn" onClick={handleSendMessage}>
              <AiOutlineSend size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;