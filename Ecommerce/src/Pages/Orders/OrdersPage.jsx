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
  Divider,
  Grid,
  useTheme,
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <ReceiptIcon sx={{ fontSize: 40 }} />
        <Typography variant="h4" fontWeight={700}>
          My Orders
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <ReceiptIcon
              sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" mb={2}>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Start ordering to see your order history here
            </Typography>
            <Button variant="contained" onClick={() => navigate("/Explore")}>
              Browse Restaurants
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {orders.map((order) => (
            <Card key={order.id} sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="start"
                  mb={2}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h6" color="primary" fontWeight={600}>
                      ₹{formatPrice(order.totalAmount)}
                    </Typography>
                    {order.promoUsed && (
                      <Chip
                        label={`Promo: ${order.promoUsed}`}
                        size="small"
                        color="success"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                </Box>

                {order.restaurantName && (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mb={2}
                    sx={{
                      p: 1.5,
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.02)",
                      borderRadius: 1,
                    }}
                  >
                    {order.restaurantImage && (
                      <CardMedia
                        component="img"
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 1,
                          objectFit: "cover",
                        }}
                        image={
                          order.restaurantImage &&
                          order.restaurantImage.trim() !== ""
                            ? order.restaurantImage
                            : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"
                        }
                        alt={order.restaurantName}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";
                        }}
                      />
                    )}
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <RestaurantIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {order.restaurantName}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1" fontWeight={600}>
                      Order Items ({order.items?.length || 0})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {order.items?.map((item) => (
                        <Box
                          key={item.id}
                          display="flex"
                          gap={2}
                          sx={{
                            p: 1.5,
                            bgcolor:
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(0,0,0,0.01)",
                            borderRadius: 1,
                          }}
                        >
                          {item.productImage && (
                            <CardMedia
                              component="img"
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 1,
                                objectFit: "cover",
                              }}
                              image={
                                item.productImage &&
                                item.productImage.trim() !== ""
                                  ? item.productImage
                                  : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
                              }
                              alt={item.productName}
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                              }}
                            />
                          )}
                          <Box flex={1}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {item.productName}
                            </Typography>
                            {item.category && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.category}
                              </Typography>
                            )}
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mt={1}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Qty: {item.quantity}
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                ₹{formatPrice(item.price * item.quantity)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default OrdersPage;
