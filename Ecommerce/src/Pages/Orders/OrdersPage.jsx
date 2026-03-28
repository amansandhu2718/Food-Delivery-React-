import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  useTheme,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ReceiptIcon from "@mui/icons-material/Receipt";
import api from "../../utils/api";
import { GetColors } from "../../utils/Theme";

function OrdersPage() {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/transactions");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (paise) => {
    return (paise / 100).toFixed(2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="xxl" sx={{ px: { xs: 2, md: 8 } }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography sx={{ color: "primary.main", fontWeight: 900, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.3em", mb: 0.5 }}>
            Archive
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Your Journals
          </Typography>
        </Box>

        {orders.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              bgcolor: "background.paper",
              borderRadius: "48px",
              border: "1px solid " + (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <ReceiptIcon sx={{ fontSize: 64, color: "text.disabled", mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>No orders yet</Typography>
            <Typography sx={{ color: "text.secondary", mb: 4, maxWidth: 300 }}>
              Your Cravvy history is waiting to be written. Start your first journey today.
            </Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/Explore")}
              sx={{
                borderRadius: "100px",
                px: 6,
                py: 1.5,
                fontWeight: 800,
                bgcolor: "primary.main"
              }}
            >
              Begin Discovery
            </Button>
          </Box>
        ) : (
          <Stack spacing={4}>
            {orders.map((order) => (
              <Box
                key={order.id}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: "40px",
                  p: { xs: 3, md: 5 },
                  border: "1px solid " + (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                  transition: "all 0.3s ease",
                  "&:hover": { boxShadow: theme.palette.mode === "dark" ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.04)" }
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 4 }}>
                  <Box>
                    <Typography sx={{ color: "primary.main", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", mb: 1 }}>
                      JOURNAL #{order.id.slice(-8).toUpperCase()}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {order.restaurantName}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.85rem" }}>
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                    <Typography sx={{ fontWeight: 900, fontSize: "1.75rem", color: "text.primary", lineHeight: 1 }}>
                      ₹{formatPrice(order.totalAmount)}
                    </Typography>
                    <Typography sx={{ color: "secondary.main", fontWeight: 800, fontSize: "0.75rem", mt: 1 }}>
                      TXN COMPLETED
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4, opacity: 0.5 }} />

                <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                  {order.items?.map((item) => (
                    <Box key={item.id} sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                      <Box
                        component="img"
                        src={item.productImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"}
                        sx={{ width: 64, height: 64, borderRadius: "20px", objectFit: "cover" }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: "1rem" }}>{item.productName}</Typography>
                        <Typography sx={{ color: "text.secondary", fontSize: "0.75rem", fontWeight: 600 }}>
                          {item.quantity} × ₹{formatPrice(item.price)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ mt: 5, pt: 4, borderTop: "1px solid " + theme.palette.divider, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="text"
                    onClick={() => navigate(`/orders/${order.id}`)}
                    sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.85rem", "&:hover": { color: "primary.main", bgcolor: "transparent" } }}
                  >
                    View Details
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default OrdersPage;
