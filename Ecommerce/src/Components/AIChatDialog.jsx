import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Box,
  Typography,
  Paper,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material";
import { io } from "socket.io-client";

import { GetColors } from "../utils/Theme";
import { getAccessToken } from "../utils/authService";
import { useSelector } from "react-redux";

function AIChatDialog({ open, onClose }) {
  const theme = useTheme();
  const { isAuthenticated, loading, accessToken } = useSelector(
    (state) => state.auth,
  );

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  // Initialize socket
  useEffect(() => {
    const token = getAccessToken();
    console.log("AIChatDialog - open:", open, "hasToken:", !!token);
    if (!open || !token) return;

    console.log("Connecting socket to http://localhost:5001");
    socketRef.current = io("http://localhost:5001", {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: token,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to AI chat");
    });

    socketRef.current.on("chat:history", (history) => {
      setMessages(
        history.map((m, index) => ({
          id: index + 1,
          text: m.content,
          sender: m.sender,
          timestamp: new Date(m.created_at),
        })),
      );
    });

    socketRef.current.on("chat:reply", (message) => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: message.content,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [open, accessToken]);

  const handleSend = () => {
    console.log("handleSend called - input:", input);
    console.log("Socket state - connected:", socketRef.current?.connected);

    if (!input.trim() || !socketRef.current?.connected) {
      console.log(
        "handleSend returning early - input empty or socket not connected",
      );
      return;
    }
    console.log("Sending message:1", input);

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: input,
        sender: "user",
        timestamp: new Date(),
      },
    ]);
    console.log("Sending message:2", input);

    socketRef.current.emit("chat:message", input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
          color: "text.primary",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <SmartToyIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6" fontWeight={600}>
            AI Assistant
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon
            sx={{
              color: "text.primary",
            }}
          />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
                gap: 1,
              }}
            >
              {message.sender === "ai" && (
                <Avatar
                  icon={<SmartToyIcon sx={{ color: "#fff" }} />}
                  color={theme.palette.primary.main}
                />
              )}

              <Paper
                elevation={2}
                sx={{
                  maxWidth: "70%",
                  p: 2,
                  backgroundColor:
                    message.sender === "user"
                      ? "primary.main"
                      : "background.paper",
                  color:
                    message.sender === "user"
                      ? "white"
                      : "text.primary",
                }}
              >
                <Box sx={{ "& p": { m: 0 } }}>
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Paper>

              {message.sender === "user" && (
                <Avatar
                  icon={<PersonIcon sx={{ color: "#fff" }} />}
                  color={theme.palette.secondary.main}
                />
              )}
            </Box>
          ))}

          {loading && (
            <Box display="flex" gap={1}>
              <Avatar
                icon={<SmartToyIcon sx={{ color: "#fff" }} />}
                color={theme.palette.primary.main}
              />
              <Paper sx={{ p: 2 }}>
                <CircularProgress size={18} />
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Custom Avatar ---------- */
function Avatar({ icon, color }) {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        bgcolor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
  );
}

export default AIChatDialog;
