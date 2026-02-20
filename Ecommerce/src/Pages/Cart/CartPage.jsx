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
  IconButton,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api from "../../utils/api";
import { GetColors } from "../../utils/Theme";

function CartPage() {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/cart");
      setCartItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, productId, newQuantity) => {
    try {
      if (newQuantity === 0) {
        await api.delete(`/api/cart/item/${cartItemId}`);
      } else {
        await api.put(`/api/cart/item/${cartItemId}`, { quantity: newQuantity });
      }
      await fetchCart();
    } catch (err) {
      console.error("Failed to update cart", err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await api.delete(`/api/cart/item/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const formatPrice = (paise) => {
    return (paise / 100).toFixed(2);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) return;
    navigate("/payment");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={2}>
              Your cart is empty
            </Typography>
            <Button variant="contained" onClick={() => navigate("/Explore")}>
              Browse Restaurants
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item.id} sx={{ mb: 2, boxShadow: 2 }}>
                <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: "100%", sm: 150 },
                      height: { xs: 200, sm: 150 },
                      objectFit: "cover",
                    }}
                    image={
                      item.image && item.image.trim() !== ""
                        ? item.image
                        : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
                    }
                    alt={item.name}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                    }}
                  />
                  <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={600}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.restaurantName}
                        </Typography>
                        {item.category && (
                          <Typography variant="caption" color="text.secondary">
                            {item.category}
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt="auto"
                    >
                      <Typography variant="h6" color="primary">
                        ₹{formatPrice(item.price * item.quantity)}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.productId, item.quantity - 1)}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.productId, item.quantity + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Stack>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3, position: "sticky", top: 20 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </Typography>
                  <Typography variant="body2">
                    ₹{formatPrice(calculateTotal())}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Delivery Charges
                  </Typography>
                  <Typography variant="body2">₹40.00</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight={600}>
                    Total
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    ₹{(parseFloat(formatPrice(calculateTotal())) + 40).toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleProceedToPayment}
                  sx={{ mb: 2 }}
                >
                  Proceed to Payment
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/Explore")}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default CartPage;
