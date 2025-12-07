import React, { useState, useEffect } from 'react';
import './Messages.css';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/messages');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setMessages(data.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      alert('Failed to fetch messages. Make sure your backend is running.');
    }
  };

  const handleReply = () => {
    if (!reply.trim()) return;
    alert(`Reply sent to ${selected.email}`);
    setReply('');
    setSelected(null);
  };

  return (
    <div className="messages-container">
      <h1>Messages</h1>
      
      <div className="messages-grid">
        {/* Message List */}
        <div className="message-list">
          <div className="list-header">
            <h2>Inbox ({messages.length})</h2>
          </div>
          
          <div className="list-items">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`message-item ${selected?._id === msg._id ? 'active' : ''}`}
                onClick={() => setSelected(msg)}
              >
                <h3>{msg.name}</h3>
                <p className="email">{msg.email}</p>
                <p className="subject">{msg.subject}</p>
                <p className="preview">{msg.message}</p>
                <p className="date">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="message-detail">
          {selected ? (
            <>
              <div className="detail-content">
                <h2>{selected.subject}</h2>
                <p className="from">From: {selected.name}</p>
                <p className="email">{selected.email}</p>
                <p className="date">{new Date(selected.createdAt).toLocaleString()}</p>
                
                <div className="message-body">
                  {selected.message}
                </div>
              </div>

              <div className="reply-section">
                <label>Reply</label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                />
                <button onClick={handleReply}>Send Reply</button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}