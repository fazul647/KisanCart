import React, { useEffect, useState, useRef, useCallback } from "react";
import API from "../api/axios";
import { getSocket } from "../api/socket";
import { sendRealtimeMessage } from "../api/realtimeMessages";
import "../styles/ChatPage.css";

// Helper function to format timestamps
const formatTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// Message status component
const MessageStatus = ({ status }) => {
  if (status === 'sending') return <span className="message-status sending">✓</span>;
  if (status === 'sent') return <span className="message-status sent">✓</span>;
  if (status === 'delivered') return <span className="message-status delivered">✓✓</span>;
  if (status === 'read') return <span className="message-status read">✓✓</span>;
  return null;
};

// Typing indicator component
const TypingIndicator = ({ userName }) => (
  <div className="typing-indicator">
    <div className="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <span className="typing-text">{userName} is typing...</span>
  </div>
);

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [messageStatuses, setMessageStatuses] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingMessages, setSendingMessages] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("kisan_user"));
  const currentUserId = user?._id?.toString();

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar on mobile when selecting a user
  useEffect(() => {
    if (selectedUser && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [selectedUser]);

  // Load messages
  useEffect(() => {
    if (!currentUserId) return;
    
    setLoading(true);
    API.get("/messages/inbox")
      .then((res) => {
        const fetchedMessages = res.data.messages || [];
        const normalizedMessages = fetchedMessages.map(msg => ({
          ...msg,
          _id: msg._id?.toString(),
          sender: { ...msg.sender, _id: msg.sender._id?.toString() },
          receiver: { ...msg.receiver, _id: msg.receiver._id?.toString() }
        }));
        setMessages(normalizedMessages);
      })
      .catch((err) => console.error("Error loading messages:", err))
      .finally(() => setLoading(false));
  }, [currentUserId]);

  // Socket connection and event handlers
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !currentUserId) return;

    const handleNewMessage = (msg) => {
      const normalizedMsg = {
        ...msg,
        _id: msg._id?.toString(),
        sender: { ...msg.sender, _id: msg.sender._id?.toString() },
        receiver: { ...msg.receiver, _id: msg.receiver._id?.toString() }
      };
      
      setMessages((prev) => {
        const exists = prev.some(m => m._id === normalizedMsg._id);
        if (exists) return prev;
        
        const withoutTemp = prev.filter(m => 
          !(m._id?.startsWith('temp-') && m.text === normalizedMsg.text && 
            m.sender._id === normalizedMsg.sender._id)
        );
        
        return [...withoutTemp, normalizedMsg];
      });
      
      if (normalizedMsg.sender._id === currentUserId) {
        setMessageStatuses(prev => ({ 
          ...prev, 
          [normalizedMsg._id]: normalizedMsg.status || 'sent' 
        }));
        setSendingMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(normalizedMsg._id);
          return newSet;
        });
      }
    };

    const handleMessageDelivered = ({ messageId }) => {
      const id = messageId?.toString();
      setMessageStatuses(prev => ({ ...prev, [id]: 'delivered' }));
    };

    const handleMessageRead = ({ messageId }) => {
      const id = messageId?.toString();
      setMessageStatuses(prev => ({ ...prev, [id]: 'read' }));
      setMessages(prev => prev.map(msg => 
        msg._id === id ? { ...msg, read: true } : msg
      ));
    };

    const handleTyping = ({ userId, isTyping: typing }) => {
      if (userId?.toString() === selectedUser?._id?.toString()) {
        setIsTyping(typing);
      }
    };

    const handleUserOnline = ({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, userId?.toString()]));
    };

    const handleUserOffline = ({ userId }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId?.toString());
        return newSet;
      });
    };

    socket.on("message:received", handleNewMessage);
    socket.on("message:sent", handleNewMessage);
    socket.on("message:delivered", handleMessageDelivered);
    socket.on("message:read", handleMessageRead);
    socket.on("typing", handleTyping);
    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    socket.emit("user:online", currentUserId);

    return () => {
      socket.off("message:received", handleNewMessage);
      socket.off("message:sent", handleNewMessage);
      socket.off("message:delivered", handleMessageDelivered);
      socket.off("message:read", handleMessageRead);
      socket.off("typing", handleTyping);
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
    };
  }, [currentUserId, selectedUser]);

  // Get unique users from messages
  const users = React.useMemo(() => {
    const userMap = new Map();
    
    messages.forEach((msg) => {
      const other = msg.sender._id === currentUserId ? msg.receiver : msg.sender;
      if (!other?._id) return;
      
      const otherId = other._id.toString();
      
      if (!userMap.has(otherId)) {
        const conversationMessages = messages.filter(m => 
          (m.sender._id === currentUserId && m.receiver._id === otherId) ||
          (m.sender._id === otherId && m.receiver._id === currentUserId)
        );
        
        const lastMessage = conversationMessages
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        
        const unreadCount = conversationMessages.filter(
          m => m.sender._id === otherId && m.receiver._id === currentUserId && !m.read
        ).length;
        
        userMap.set(otherId, { ...other, lastMessage, unreadCount });
      }
    });
    
    return Array.from(userMap.values())
      .sort((a, b) => {
        const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
        const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
        return dateB - dateA;
      })
      .filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [messages, currentUserId, searchQuery]);

  // Filter messages for selected user
  const filteredMessages = React.useMemo(() => {
    if (!selectedUser || !currentUserId) return [];
    
    const selectedUserId = selectedUser._id.toString();
    
    return messages
      .filter((msg) => {
        const senderId = msg.sender?._id?.toString();
        const receiverId = msg.receiver?._id?.toString();
        
        return (senderId === currentUserId && receiverId === selectedUserId) ||
               (senderId === selectedUserId && receiverId === currentUserId);
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [messages, selectedUser, currentUserId]);

  // Auto scroll to bottom
  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages, scrollToBottom]);

  // Add emoji handler function
  const addEmoji = (emoji) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;
    if (!selectedUser) {
      alert("Select a user first");
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const receiverId = selectedUser._id.toString();
    
    const tempMessage = {
      _id: tempId,
      text: text.trim(),
      sender: { _id: currentUserId, name: user?.name },
      receiver: { _id: receiverId, name: selectedUser.name },
      createdAt: new Date().toISOString(),
      status: 'sending',
      read: false
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setSendingMessages(prev => new Set(prev).add(tempId));
    setText("");
    
    const socket = getSocket();
    if (socket && selectedUser) {
      socket.emit("typing", { receiverId, isTyping: false });
    }

    try {
      const response = await sendRealtimeMessage({
        receiverId: receiverId,
        text: text.trim(),
      });
      
      const realMessage = {
        ...response,
        _id: response._id?.toString(),
        sender: { ...response.sender, _id: response.sender._id?.toString() },
        receiver: { ...response.receiver, _id: response.receiver._id?.toString() }
      };
      
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? realMessage : msg
      ));
      
      setMessageStatuses(prev => ({ 
        ...prev, 
        [realMessage._id]: realMessage.status || 'sent' 
      }));
      
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
    }
  };

  // Handle typing indicator
  const handleTypingInput = useCallback(() => {
    const socket = getSocket();
    if (!socket || !selectedUser) return;
    
    const receiverId = selectedUser._id.toString();
    socket.emit("typing", { receiverId, isTyping: true });
    
    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      socket.emit("typing", { receiverId, isTyping: false });
    }, 1000);
    setTypingTimeout(timeout);
  }, [selectedUser, typingTimeout]);

  // Mark messages as read
  useEffect(() => {
    if (!selectedUser || !currentUserId || !messages.length) return;
    
    const selectedUserId = selectedUser._id.toString();
    const unreadMessages = messages.filter(
      m => m.sender?._id?.toString() === selectedUserId && 
           m.receiver?._id?.toString() === currentUserId && 
           !m.read
    );
    
    if (unreadMessages.length > 0) {
      const socket = getSocket();
      unreadMessages.forEach(msg => {
        socket?.emit("messages:mark-read", { messageId: msg._id.toString() });
        setMessages(prev => prev.map(m => 
          m._id === msg._id ? { ...m, read: true } : m
        ));
      });
    }
  }, [selectedUser, currentUserId, messages]);

  // Helper functions
  const getAvatarColor = (name) => {
    const colors = ['#075E54', '#128C7E', '#25D366', '#34B7F1', '#6B7280', '#8B5CF6'];
    const index = name?.length % colors.length || 0;
    return colors[index];
  };

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(msg => {
      const date = new Date(msg.createdAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(filteredMessages);

  // Format date header
  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="chat-app">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder" style={{ backgroundColor: '#25D366' }}>
                {getInitials(user?.name)}
              </div>
            )}
          </div>
          <div className="user-info">
            <h3 className="user-name">{user?.name || "User"}</h3>
          </div>
        </div>

        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="chat-list">
          {loading ? (
            <div className="loading-chats">Loading chats...</div>
          ) : users.length === 0 ? (
            <div className="no-chats">
              <div className="no-chats-icon">💬</div>
              <p>No conversations yet</p>
            </div>
          ) : (
            users.map((u) => {
              const isOnline = onlineUsers.has(u._id?.toString());
              const lastMessagePreview = u.lastMessage?.text?.substring(0, 30) + 
                (u.lastMessage?.text?.length > 30 ? '...' : '') || "No messages yet";
              
              return (
                <div
                  key={u._id}
                  onClick={() => setSelectedUser(u)}
                  className={`chat-item ${selectedUser?._id?.toString() === u._id?.toString() ? "active" : ""}`}
                >
                  <div className="chat-avatar">
                    <div className="avatar-wrapper">
                      <div 
                        className="avatar-placeholder" 
                        style={{ backgroundColor: getAvatarColor(u.name) }}
                      >
                        {getInitials(u.name)}
                      </div>
                      {isOnline && <div className="online-dot"></div>}
                    </div>
                  </div>
                  
                  <div className="chat-info">
                    <div className="chat-header">
                      <h4 className="chat-name">{u.name}</h4>
                      <span className="chat-time">
                        {u.lastMessage ? formatTime(u.lastMessage.createdAt) : ""}
                      </span>
                    </div>
                    <div className="chat-preview">
                      <p className="last-message">
                        {u.lastMessage?.sender?._id?.toString() === currentUserId ? "You: " : ""}
                        {lastMessagePreview}
                      </p>
                      {u.unreadCount > 0 && (
                        <span className="unread-badge">{u.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Window */}
      {selectedUser ? (
        <div className="chat-window">
          <div className="chat-header-bar">
            {/* Mobile back button */}
            <button 
              className="mobile-back-btn"
              onClick={() => window.innerWidth <= 768 && setSidebarOpen(true)}
            >
              ←
            </button>
            
            <div className="chat-user-info">
              <div className="chat-user-avatar">
                <div 
                  className="avatar-placeholder" 
                  style={{ backgroundColor: getAvatarColor(selectedUser.name) }}
                >
                  {getInitials(selectedUser.name)}
                </div>
                {onlineUsers.has(selectedUser._id?.toString()) && <div className="online-dot-header"></div>}
              </div>
              <div className="chat-user-details">
                <h3 className="chat-user-name">{selectedUser.name}</h3>
              </div>
            </div>
            <div className="chat-actions">
              <button className="action-btn">
                <span className="action-icon">⋮</span>
              </button>
            </div>
          </div>

          <div ref={chatRef} className="messages-area">
            {Object.entries(messageGroups).map(([date, msgs]) => (
              <React.Fragment key={date}>
                <div className="date-divider">
                  <span>{formatDateHeader(date)}</span>
                </div>
                {msgs.map((msg, idx) => {
                  const isMe = msg.sender?._id?.toString() === currentUserId;
                  const showAvatar = !isMe && (idx === 0 || 
                    msgs[idx - 1]?.sender?._id?.toString() !== msg.sender?._id?.toString());
                  
                  return (
                    <div
                      key={msg._id}
                      className={`message-wrapper ${isMe ? "message-sent" : "message-received"}`}
                    >
                      {showAvatar && (
                        <div className="message-avatar">
                          <div 
                            className="avatar-placeholder small" 
                            style={{ backgroundColor: getAvatarColor(msg.sender.name) }}
                          >
                            {getInitials(msg.sender.name)}
                          </div>
                        </div>
                      )}
                      <div className={`message-bubble ${isMe ? "bubble-sent" : "bubble-received"} ${!showAvatar && !isMe ? "bubble-grouped" : ""}`}>
                        <p className="message-text">{msg.text}</p>
                        <div className="message-meta">
                          <span className="message-time">
                            {formatTime(msg.createdAt)}
                          </span>
                          {isMe && (
                            <MessageStatus 
                              status={sendingMessages.has(msg._id) ? 'sending' : (messageStatuses[msg._id] || msg.status)} 
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
            
            {isTyping && <TypingIndicator userName={selectedUser.name} />}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <div className="input-container">
              <div className="emoji-picker-container" ref={emojiPickerRef}>
                <button 
                  className="input-btn emoji-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <span className="btn-icon">😊</span>
                </button>
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <div style={{ 
                      background: 'white', 
                      borderRadius: '12px', 
                      padding: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 1fr)',
                      gap: '4px',
                      width: '280px',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}>
                      {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'].
                        map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => addEmoji(emoji)}
                            style={{
                              fontSize: '24px',
                              padding: '8px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f2f5'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            {emoji}
                          </button>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={inputRef}
                type="text"
                className="message-input"
                placeholder="Type a message"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  handleTypingInput();
                }}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              />
              <button 
                onClick={sendMessage}
                className={`input-btn send-btn ${!text.trim() ? "disabled" : ""}`}
                disabled={!text.trim()}
              >
                <span className="btn-icon">📤</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">💬</div>
            <h2>WhatsApp Web</h2>
            <p>Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}