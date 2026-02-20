import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function EmailOTP() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState(location.state?.otp || "");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await api.post("/api/auth/verify-email", { email, code });
      toast.success("Email verified, please login");
      navigate("/login", { replace: true });
    } catch (e) {
      toast.error(e.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/api/auth/resend-otp", { email });
      toast.success("Verification code resent");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to resend code");
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 480, margin: "0 auto" }}>
      <Typography variant="h5">Verify your email</Typography>
      <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={handleVerify}>
            Verify
          </Button>
          <Button variant="outlined" onClick={handleResend}>
            Resend code
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
