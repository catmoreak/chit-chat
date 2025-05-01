import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { Send, User, RefreshCw } from 'lucide-react';
import { supabase, type Message } from '../lib/supabase';
import './Chat.css';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('chitchat-username') || '';
  });
  const [isUsernameSet, setIsUsernameSet] = useState(!!username);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch messages and subscribe to changes
  useEffect(() => {
    if (!isUsernameSet) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(50);
        
        if (error) {
          console.error('Error fetching messages:', error);
          setError('Failed to load messages. Please try again.');
        } else {
          setMessages(data as Message[]);
          setError(null);
        }
      } catch (err) {
        console.error('Error in messages fetch:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prevMessages => [...prevMessages, newMessage]);
        scrollToBottom();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isUsernameSet]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newMessage.trim() || !username) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ content: newMessage, username }]);
      
      if (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message. Please try again.');
      } else {
        setNewMessage('');
        setError(null);
      }
    } catch (err) {
      console.error('Error in send message:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSetUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('chitchat-username', username);
      setIsUsernameSet(true);
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'h:mm a');
    } catch (error) {
      return 'Invalid time';
    }
  };

  if (!isUsernameSet) {
    return (
      <div className="username-container">
        <div className="username-card">
          <h1>Welcome to Chit-Chat</h1>
          <p>Choose a username to start chatting</p>
          
          <form onSubmit={handleSetUsername} className="username-form">
            <div className="input-group">
              <User size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                maxLength={20}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="primary-button">
              Start Chatting
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chit-Chat</h1>
        <div className="username-display">
          <User size={16} />
          <span>{username}</span>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading-state">
            <RefreshCw size={24} className="spin" />
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages yet. Be the first to send one!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwnMessage = message.username === username;
              
              return (
                <div 
                  key={message.id} 
                  className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
                >
                  {!isOwnMessage && (
                    <div className="message-username">{message.username}</div>
                  )}
                  <div className="message-bubble">
                    <div className="message-content">{message.content}</div>
                    <div className="message-time">{formatTime(message.created_at)}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
        
        {error && <div className="error-message">{error}</div>}
      </div>

      <form onSubmit={handleSendMessage} className="message-input-container">
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          maxLength={500}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!newMessage.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;