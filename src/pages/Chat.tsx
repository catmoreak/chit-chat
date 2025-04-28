import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (input.trim() === '') return;
    const newMessage: Message = { id: Date.now(), text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
  };

  // Scroll to bottom when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Chat Message List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          background: 'var(--bg-dark)',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem',
              borderRadius: '5px',
              background: 'var(--card-bg)',
              color: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: '1rem',
          borderTop: '1px solid var(--card-border)',
          background: 'var(--card-bg)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            width: '80%',
            padding: '0.5rem',
            marginRight: '1rem',
            background: 'var(--bg-dark)',
            color: 'white',
            border: '1px solid var(--card-border)',
            borderRadius: '3px',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
          }}
        >
          Send !
        </button>
      </div>
    </div>
  );
};

export default Chat;