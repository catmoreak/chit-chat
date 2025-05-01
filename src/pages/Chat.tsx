import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { Send, User, RefreshCw, Mail } from 'lucide-react';
import { supabase, type Message } from '../lib/supabase';
import './Chat.css';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('chitchat-username') || '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setEmail(session.user.email || '');
        setUsername(session.user.email?.split('@')[0] || '');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    
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
  }, [isAuthenticated]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newMessage.trim() || !username || !isAuthenticated) return;
    
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setAuthError('Check your email for the magic link!');
      }
    } catch (err) {
      setAuthError('Failed to send magic link. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail('');
    setUsername('');
  };

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'h:mm a');
    } catch (error) {
      return 'Invalid time';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Welcome to Chit-Chat</h1>
          <p>Sign in with your email to start chatting</p>
          
          <form onSubmit={handleSignIn} className="auth-form">
            <div className="input-group">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                autoFocus
              />
            </div>
            {authError && <div className="auth-error">{authError}</div>}
            <button type="submit" className="primary-button">
              Send Magic Link
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
        <div className="user-controls">
          <div className="username-display">
            <User size={16} />
            <span>{username}</span>
          </div>
          <button onClick={handleSignOut} className="sign-out-button">
            Sign Out
          </button>
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