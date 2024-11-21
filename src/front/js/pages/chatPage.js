import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";

const ChatPage = () => {
  const { partnerUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/messages/${partnerUserId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch messages.");
        }

        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [partnerUserId]);

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    const messageData = {
      to_user_id: partnerUserId,
      content: newMessage,
    };

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/messages/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("Error sending message.");
      }

      const data = await response.json();

      // Assuming the response contains the message data
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          from_user_id: data.from_user_id, // Adjust this according to your backend response
          to_user_id: data.to_user_id,
          content: data.content,
          timestamp: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with Partner</h2>
      </div>
      <div className="chat-box">
        <div className="messages">
          {messages.map((message) => (
            <div
              key={message.timestamp}  // It's better to use timestamp or a unique ID as key
              className={`message ${message.from_user_id === localStorage.getItem("user_id") ? "sent" : "received"}`}
            >
              <p>{message.content}</p>
              <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-input">
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
