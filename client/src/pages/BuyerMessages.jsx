import React, { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function BuyerMessages() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all, unread
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const messagesEndRef = useRef(null);

  /* ============ LOAD MESSAGES ============ */
  useEffect(() => {
    loadInbox();
  }, []);

  async function loadInbox() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/messages/inbox");
      setMessages(res.data.messages || []);
      
      // Mark all messages as read
      await API.patch("/messages/mark-read").catch(() => {});
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ============ FILTER MESSAGES ============ */
  useEffect(() => {
    let result = [...messages];
    
    // Apply read/unread filter
    if (activeFilter === "unread") {
      result = result.filter(msg => !msg.read);
    }
    
    // Apply search filter
    const term = searchTerm.toLowerCase();
    if (term) {
      result = result.filter(msg =>
        msg.sender?.name?.toLowerCase().includes(term) ||
        msg.product?.productName?.toLowerCase().includes(term) ||
        msg.text?.toLowerCase().includes(term)
      );
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredMessages(result);
  }, [searchTerm, activeFilter, messages]);

  /* ============ SEND REPLY ============ */
  async function sendReply() {
    if (!replyText.trim() || !replyingTo) return;
    
    setSendingReply(true);
    try {
      await API.post("/messages/send", {
        receiverId: replyingTo.sender._id,
        productId: replyingTo.product?._id,
        text: replyText.trim(),
      });
      
      // Refresh messages
      loadInbox();
      setReplyText("");
      setReplyingTo(null);
      
      // Show success
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Reply sent successfully',
          type: 'success'
        }
      });
      window.dispatchEvent(event);
      
    } catch (err) {
      console.error("Failed to send reply:", err);
      setError("Failed to send reply. Please try again.");
    } finally {
      setSendingReply(false);
    }
  }

  /* ============ MARK AS READ ============ */
  async function markAsRead(messageId) {
    try {
      await API.patch(`/messages/${messageId}/read`);
      // Update local state
      setMessages(prev => prev.map(msg =>
        msg._id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }

  /* ============ FORMAT FUNCTIONS ============ */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  /* ============ MESSAGE STATS ============ */
  const unreadCount = messages.filter(msg => !msg.read).length;
  const farmerMessages = messages.filter(msg => msg.sender?.role === "farmer").length;
  const latestMessage = messages.length > 0 ? new Date(messages[0].createdAt) : null;

  return (
    <div className="container mt-4 mb-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Messages</h2>
          <p className="text-muted">Communicate directly with farmers</p>
        </div>
        <button 
          onClick={loadInbox} 
          className="btn btn-outline-secondary"
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* STATS */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary bg-opacity-10 border-0">
            <div className="card-body text-center py-3">
              <h3 className="fw-bold mb-0">{messages.length}</h3>
              <small className="text-muted">Total Messages</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning bg-opacity-10 border-0">
            <div className="card-body text-center py-3">
              <h3 className="fw-bold mb-0">{unreadCount}</h3>
              <small className="text-muted">Unread</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success bg-opacity-10 border-0">
            <div className="card-body text-center py-3">
              <h3 className="fw-bold mb-0">{farmerMessages}</h3>
              <small className="text-muted">From Farmers</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info bg-opacity-10 border-0">
            <div className="card-body text-center py-3">
              <h3 className="fw-bold mb-0">{filteredMessages.length}</h3>
              <small className="text-muted">Showing</small>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search messages by sender, product, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your messages...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredMessages.length === 0 && (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-3">💬</div>
          <h4 className="mb-3">No messages found</h4>
          <p className="text-muted mb-4">
            {messages.length === 0 
              ? "You don't have any messages yet." 
              : "Try adjusting your search or filters."}
          </p>
          {messages.length === 0 ? (
            <Link to="/products" className="btn btn-success">
              <i className="bi bi-shop me-2"></i>
              Browse Products
            </Link>
          ) : (
            <button 
              className="btn btn-outline-success"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* MESSAGES LIST */}
      <div className="row">
        <div className="col-lg-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white border-bottom-0">
              <h5 className="mb-0">Messages ({filteredMessages.length})</h5>
            </div>
            
            <div className="card-body p-0">
              {filteredMessages.map(msg => {
                const isUnread = !msg.read;
                const isSelected = selectedMessage?._id === msg._id;
                
                return (
                  <div 
                    key={msg._id} 
                    className={`message-item p-4 border-bottom ${isSelected ? 'bg-light' : ''} ${isUnread ? 'border-start border-success border-3' : ''}`}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.read) markAsRead(msg._id);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="row align-items-center">
                      {/* SENDER AVATAR */}
                      <div className="col-auto">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${msg.sender?.role === 'farmer' ? 'bg-success bg-opacity-10' : 'bg-primary bg-opacity-10'}`}
                             style={{ width: '50px', height: '50px' }}>
                          <span className={msg.sender?.role === 'farmer' ? 'text-success fs-5' : 'text-primary fs-5'}>
                            {msg.sender?.role === 'farmer' ? '👨‍🌾' : '👤'}
                          </span>
                        </div>
                      </div>
                      
                      {/* MESSAGE CONTENT */}
                      <div className="col">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">
                              {msg.sender?.name}
                              {msg.sender?.role === 'farmer' && (
                                <span className="badge bg-success ms-2">Farmer</span>
                              )}
                              {isUnread && (
                                <span className="badge bg-warning ms-2">New</span>
                              )}
                            </h6>
                            <p className="text-muted small mb-1">
                              Re: <strong>{msg.product?.productName || 'Product Discussion'}</strong>
                            </p>
                          </div>
                          <span className="text-muted small">{formatDate(msg.createdAt)}</span>
                        </div>
                        
                        <p className="mb-0 mt-2">
                          {msg.text}
                          {isSelected && (
                            <button
                              className="btn btn-sm btn-outline-success ms-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReplyingTo(msg);
                              }}
                            >
                              <i className="bi bi-reply me-1"></i>
                              Reply
                            </button>
                          )}
                        </p>
                        
                        {/* PRODUCT INFO */}
                        {msg.product && (
                          <div className="mt-3 d-flex align-items-center bg-light p-2 rounded">
                            {msg.product.productImages?.[0] && (
                              <img 
                                src={msg.product.productImages[0]} 
                                alt={msg.product.productName}
                                className="rounded me-2"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
                            )}
                            <div>
                              <small className="fw-bold d-block">{msg.product.productName}</small>
                              <small className="text-muted">
                                ₹{msg.product.price} per {msg.product.unit}
                              </small>
                            </div>
                            <Link 
                              to={`/products/${msg.product._id}`}
                              className="btn btn-sm btn-outline-secondary ms-auto"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Product
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ============ REPLY MODAL ============ */}
      {replyingTo && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-reply text-success me-2"></i>
                  Reply to {replyingTo.sender.name}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setReplyingTo(null)}
                  disabled={sendingReply}
                />
              </div>

              <div className="modal-body">
                {/* ORIGINAL MESSAGE */}
                <div className="alert alert-light mb-3">
                  <div className="d-flex align-items-start">
                    <div className="flex-grow-1">
                      <p className="small text-muted mb-1">Original message:</p>
                      <p className="mb-0 fst-italic">"{replyingTo.text}"</p>
                    </div>
                  </div>
                </div>

                {/* REPLY TEXTAREA */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Your Reply</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder="Type your response..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    disabled={sendingReply}
                    autoFocus
                    style={{ resize: "none" }}
                  />
                  <small className="text-muted">
                    Your reply will be sent to {replyingTo.sender.name}
                  </small>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setReplyingTo(null)}
                  disabled={sendingReply}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={sendReply}
                  disabled={sendingReply || !replyText.trim()}
                >
                  {sendingReply ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK TIPS */}
      {filteredMessages.length > 0 && (
        <div className="mt-4">
          <div className="alert alert-info">
            <h6 className="alert-heading mb-2">
              <i className="bi bi-lightbulb me-2"></i>
              Messaging Tips
            </h6>
            <ul className="mb-0 small">
              <li>Always discuss product details before ordering</li>
              <li>Ask about delivery time and packaging</li>
              <li>Keep conversations professional and respectful</li>
              <li>Report any inappropriate messages to support</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}