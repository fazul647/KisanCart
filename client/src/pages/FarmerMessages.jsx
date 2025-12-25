import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function FarmerMessages() {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [activeMsg, setActiveMsg] = useState(null);

  useEffect(() => {
    loadInbox();
    API.patch("/messages/mark-read").catch(() => {});
  }, []);

  function loadInbox() {
    API.get("/messages/inbox")
      .then(res => setMessages(res.data.messages || []))
      .catch(err => console.error(err));
  }

  async function sendReply() {
    if (!replyText.trim()) return alert("Type reply");

    try {
      await API.post("/messages/reply", {
        receiverId: activeMsg.sender._id, // buyer
        productId: activeMsg.product?._id,
        text: replyText,
      });

      alert("Reply sent");
      setReplyText("");
      setActiveMsg(null);
      loadInbox();  
    } catch (err) {
      alert("Failed to send reply");
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Messages</h2>

      {messages.length === 0 && (
        <p className="text-muted">No messages yet.</p>
      )}

      {messages.map(m => (
        <div key={m._id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h6>
              Buyer: <strong>{m.sender?.name}</strong>
            </h6>

            <p className="text-muted small">
              Product: {m.product?.productName}
            </p>

            <p>{m.text}</p>

            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => setActiveMsg(m)}
            >
              Reply
            </button>
          </div>
        </div>
      ))}

      {/* REPLY BOX */}
      {activeMsg && (
        <div className="card shadow mt-4">
          <div className="card-body">
            <h6>
              Reply to <strong>{activeMsg.sender.name}</strong>
            </h6>

            <textarea
              className="form-control mb-2"
              rows={3}
              placeholder="Type your reply..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />

            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={sendReply}>
                Send Reply
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveMsg(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
