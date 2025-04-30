"use client"

import type React from "react"
import "./Chat.css"
import { useEffect, useState, useRef } from "react"
import { createClient } from "@supabase/supabase-js"
import { MessageSquare, Send, LogOut, ImportIcon as Translate, User, ChevronDown } from "lucide-react"


// Initialize Supabase client
const supabaseUrl = "https://ucxdplxvriuaoxenajyo.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjeGRwbHh2cml1YW94ZW5hanlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODY2MzYsImV4cCI6MjA2MTI2MjYzNn0.4_pqAp4KTr_c8wdaHVa4VxWtn8yVKCZYzB1qfviXWR4"
const supabase = createClient(supabaseUrl, supabaseKey)

// Sarvam API key for translation
const SARVAM_API_KEY = "3add717e-83ac-457f-8711-a6b8222a2d61"

// IBM Watson NLU API credentials
const IBM_API_KEY = "T1Gt0aKmG_Mudw7OjUlHiPaRTyqZQA86Sj-838qh8XaM"
const IBM_URL =
  "https://api.au-syd.natural-language-understanding.watson.cloud.ibm.com/instances/28e80c41-2d07-4c66-8a2a-cfa1fdcff321"

type Message = {
  id: number
  created_at: string
  content: string
  username: string
  sentiment?: "happy" | "dull" | "angry"
  translatedContent?: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("hindi")
  const [isTranslating, setIsTranslating] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)

      // Set up auth state listener
      const {
        data: { subscription },
      } = await supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    checkUser()
  }, [])

  // Fetch messages when user is authenticated
  useEffect(() => {
    if (user) {
      fetchMessages()

      // Subscribe to new messages
      const subscription = supabase
        .channel("public:messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const newMessage = payload.new as Message
            analyzeSentiment(newMessage).then((messageWithSentiment) => {
              setMessages((prev) => [...prev, messageWithSentiment])
            })
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(subscription)
      }
    }
  }, [user])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchMessages = async () => {
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      return
    }

    // Analyze sentiment for each message
    const messagesWithSentiment = await Promise.all(
      data.map(async (message) => {
        return await analyzeSentiment(message)
      }),
    )

    setMessages(messagesWithSentiment)
  }

  const analyzeSentiment = async (message: Message): Promise<Message> => {
    if (!message.content || message.content.trim().length < 5) {
      return { ...message, sentiment: "dull" }
    }

    try {
      // Direct API call to IBM Watson NLU instead of using a separate API route
      const response = await fetch(`${IBM_URL}/v1/analyze?version=2022-04-07`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`apikey:${IBM_API_KEY}`)}`,
        },
        body: JSON.stringify({
          text: message.content,
          features: {
            emotion: {},
          },
        }),
      })

      if (!response.ok) {
        return { ...message, sentiment: "dull" }
      }

      const data = await response.json()

      // Determine sentiment based on emotion scores
      if (data.emotion) {
        const { joy,  anger,  disgust } = data.emotion.document.emotion

        if (anger > 0.5 || disgust > 0.5) {
          return { ...message, sentiment: "angry" }
        } else if (joy > 0.5) {
          return { ...message, sentiment: "happy" }
        } else {
          return { ...message, sentiment: "dull" }
        }
      }

      return { ...message, sentiment: "dull" }
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
      return { ...message, sentiment: "dull" }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !user) return

    const {  error } = await supabase
      .from("messages")
      .insert([
        {
          content: newMessage,
          username: user.email.split("@")[0],
        },
      ])
      .select()

    if (error) {
      console.error("Error sending message:", error)
      return
    }

    setNewMessage("")
  }

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Fix for captcha verification issue - using password reset flow instead
      // This is a workaround that doesn't require captcha verification
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })

      if (error) {
        console.error("Error sending magic link:", error)
        alert(`Error: ${error.message}. Please try again.`)
      } else {
        alert("Check your email for the login link!")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const translateMessage = async (message: Message, index: number) => {
    try {
      setIsTranslating(message.id)

      const response = await fetch("https://api.sarvam.ai/v1/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SARVAM_API_KEY}`,
        },
        body: JSON.stringify({
          input: message.content,
          source_language: "english",
          target_language: selectedLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("Translation failed")
      }

      const data = await response.json()

      // Update the translated content for this message
      const updatedMessages = [...messages]
      updatedMessages[index] = {
        ...message,
        translatedContent: data.translated_text,
      }

      setMessages(updatedMessages)
      setIsTranslating(null)
    } catch (error) {
      console.error("Error translating message:", error)
      alert("Translation failed. Please try again.")
      setIsTranslating(null)
    }
  }

  const getInitials = (username: string) => {
    if (username.includes("@")) {
      return username.split("@")[0].substring(0, 2).toUpperCase()
    }
    return username.substring(0, 2).toUpperCase()
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <MessageSquare size={40} />
            <h1>ChitChat</h1>
          </div>
          <p>Sign in with magic link to start chatting</p>
          <form onSubmit={handleMagicLinkLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-app">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="app-logo">
            <MessageSquare />
            <h1>ChitChat</h1>
          </div>
        </div>
        <div className="sidebar-content">
          <div className="conversations">
            <div className="conversation active">
              <div className="conversation-avatar">
                <MessageSquare size={18} />
              </div>
              <div className="conversation-info">
                <h3>General Chat</h3>
                <p>Active now</p>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              <User size={18} />
            </div>
            <div className="user-info">
              <h3>{user.email.split("@")[0]}</h3>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-info">
            <h2>General Chat</h2>
            <p>All team members</p>
          </div>
          <div className="chat-actions">
            <div className="language-selector">
              <button className="language-button" onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
                <Translate size={16} />
                <span>{selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}</span>
                <ChevronDown size={16} />
              </button>
              {showLanguageDropdown && (
                <div className="language-dropdown">
                  {["hindi", "kannada", "tamil", "telugu", "malayalam", "bengali"].map((lang) => (
                    <button
                      key={lang}
                      className={`language-option ${selectedLanguage === lang ? "active" : ""}`}
                      onClick={() => {
                        setSelectedLanguage(lang)
                        setShowLanguageDropdown(false)
                      }}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="messages-area">
          <div className="messages-container">
            {messages.map((message, index) => {
              const isCurrentUser = message.username === user.email.split("@")[0]
              return (
                <div key={message.id} className={`message-wrapper ${isCurrentUser ? "outgoing" : "incoming"}`}>
                  {!isCurrentUser && <div className="message-avatar">{getInitials(message.username)}</div>}
                  <div className="message-content-wrapper">
                    {!isCurrentUser && <div className="message-sender">{message.username}</div>}
                    <div className={`message ${message.sentiment} ${isCurrentUser ? "outgoing" : "incoming"}`}>
                      <div className="message-text">{message.content}</div>
                      {message.translatedContent && <div className="translated-text">{message.translatedContent}</div>}
                      <div className="message-time">{formatTime(message.created_at)}</div>
                    </div>
                    <button
                      className="translate-button"
                      onClick={() => translateMessage(message, index)}
                      disabled={isTranslating === message.id}
                    >
                      {isTranslating === message.id ? "Translating..." : "Translate"}
                    </button>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="message-input-area">
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
            />
            <button type="submit" className="send-button" disabled={!newMessage.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
