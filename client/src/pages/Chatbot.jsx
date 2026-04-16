import { useState, useRef, useEffect } from "react";
import API from "../api/axios";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voiceLang, setVoiceLang] = useState("en-US"); // 🌐 language state
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const loadChats = async () => {
      const res = await API.get("/chat");
      setChat(res.data);
    };
    loadChats();
  }, []);

  // ========================
  // 🔹 Normal Send Message
  // ========================
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/chat", { message });
      const botMessage = {
        sender: "bot",
        text: res.data.reply || "No response",
      };
      setChat((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong 😔" },
      ]);
    }

    setLoading(false);
  };

  // ========================
  // 🔹 Voice Input Function
  // ========================
  const startListening = () => {
    console.log("🎤 Button clicked");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    // 🌐 dynamic language
    recognition.lang = voiceLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();

    recognition.onstart = () => {
      console.log("🎤 Listening started...");
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;

      console.log("✅ Voice detected:", speechText);

      sendMessageFromVoice(speechText); // ✅ no duplicate bug
    };

    recognition.onerror = (event) => {
      console.error("❌ Voice error:", event.error);

      if (event.error === "no-speech") {
        alert("Please speak clearly after clicking the mic 🎤");
      }
    };

    recognition.onend = () => {
      console.log("🎤 Listening stopped");
    };
  };

  // ========================
  // 🔹 Send Voice Message
  // ========================
  const sendMessageFromVoice = async (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    setChat((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await API.post("/chat", { message: text });
      const botMessage = {
        sender: "bot",
        text: res.data.reply || "No response",
      };
      setChat((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong 😔" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg rounded-4">
        <div className="card-header bg-success text-white text-center fw-bold fs-5">
          🌾 Kisan AI Assistant
        </div>

        {/* CHAT AREA */}
        <div
          className="card-body"
          style={{ height: "400px", overflowY: "auto", background: "#f8f9fa" }}
        >
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`d-flex mb-3 ${
                msg.sender === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-3 rounded-4 shadow-sm ${
                  msg.sender === "user"
                    ? "bg-success text-white"
                    : "bg-white"
                }`}
                style={{ maxWidth: "75%" }}
              >
                {msg.message || msg.text}
              </div>
            </div>
          ))}

          {loading && <div className="text-muted">🤖 AI is typing...</div>}

          <div ref={chatEndRef}></div>
        </div>

        {/* INPUT SECTION */}
        <div className="card-footer flex-column">

          {/* 🌐 LANGUAGE DROPDOWN */}
          <select
            className="form-select mb-2"
            value={voiceLang}
            onChange={(e) => setVoiceLang(e.target.value)}
          >
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="te-IN">Telugu</option>
          </select>

          <div className="d-flex">
            <input
              type="text"
              className="form-control rounded-pill me-2"
              placeholder="Ask about crops, fertilizer, prices..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              className="btn btn-outline-success rounded-pill me-2"
              onClick={startListening}
            >
              🎤
            </button>

            <button
              className="btn btn-success rounded-pill px-4"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}