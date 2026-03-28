import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function ChatPage() {
  const socketRef = useRef(null);
  const { isAuthenticated, loading, accessToken } = useSelector(
    (state) => state.auth,
  );

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    socketRef.current = io("http://localhost:5001", {
      withCredentials: true,
      transports: ["websocket"],
      auth: {
        token: accessToken,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to AI chat");
    });

    // Load previous messages
    socketRef.current.on("chat:history", (history) => {
      setMessages(history);
    });

    // AI reply
    socketRef.current.on("chat:reply", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!socketRef.current?.connected) return;

    const userMessage = {
      sender: "user",
      content: input,
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, userMessage]);

    socketRef.current.emit("chat:message", input);
    setInput("");
  };

  return (
    <div style={styles.container}>
      <h2>AI Chat</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#93fc44" : "#3cd9ee",
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    height: "80vh",
  },
  chatBox: {
    flex: 1,
    border: "1px solid #ccc",
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    backgroundColor: "#131212",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "8px",
    maxWidth: "70%",
    fontSize: "14px",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
    fontSize: "14px",
  },
  button: {
    padding: "8px 16px",
    fontSize: "14px",
    cursor: "pointer",
  },
};
