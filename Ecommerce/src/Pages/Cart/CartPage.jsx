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
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="xxl" sx={{ px: { xs: 2, md: 8 } }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography sx={{ color: "primary.main", fontWeight: 900, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.3em", mb: 0.5 }}>
            Reservation
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Your Selection
          </Typography>
        </Box>

        {cartItems.length === 0 ? (
          <Box 
            sx={{ 
                textAlign: "center", 
                py: 12, 
                bgcolor: "white", 
                borderRadius: "48px", 
                border: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 64, color: "rgba(0,0,0,0.1)", mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Your cart is empty</Typography>
            <Typography sx={{ color: "text.secondary", mb: 4, maxWidth: 300 }}>
              Discover the finest flavors from our curated collection of kitchens.
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
              Explore Collection
            </Button>
          </Box>
        ) : (
          <Grid container spacing={6}>
            <Grid item xs={12} lg={8}>
              <Stack spacing={3}>
                {cartItems.map((item) => (
                  <Box 
                    key={item.id} 
                    sx={{ 
                        display: "flex", 
                        flexDirection: { xs: "column", sm: "row" },
                        bgcolor: "white", 
                        borderRadius: "32px", 
                        overflow: "hidden",
                        border: "1px solid rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                        "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"}
                      sx={{
                        width: { xs: "100%", sm: 200 },
                        height: { xs: 200, sm: "auto" },
                        objectFit: "cover",
                      }}
                    />
                    <Box sx={{ p: 4, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {item.name}
                          </Typography>
                          <Typography sx={{ color: "primary.main", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {item.restaurantName}
                          </Typography>
                        </Box>
                        <IconButton 
                            size="small" 
                            onClick={() => removeItem(item.id)}
                            sx={{ color: "rgba(0,0,0,0.2)", "&:hover": { color: "#ff4d4d" } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ mt: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: "1.25rem" }}>
                          ₹{formatPrice(item.price * item.quantity)}
                        </Typography>
                        
                        <Stack direction="row" alignItems="center" bgcolor="rgba(0,0,0,0.03)" borderRadius="100px" px={1}>
                          <IconButton size="small" onClick={() => updateQuantity(item.id, item.productId, item.quantity - 1)}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ fontWeight: 800, mx: 1.5, fontSize: "0.9rem" }}>{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => updateQuantity(item.id, item.productId, item.quantity + 1)}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} lg={4}>
              <Box 
                sx={{ 
                    bgcolor: "white", 
                    p: 5, 
                    borderRadius: "40px", 
                    border: "1px solid rgba(0,0,0,0.05)",
                    position: "sticky",
                    top: 100
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Order Summary
                </Typography>
                
                <Stack spacing={2.5} sx={{ mb: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Subtotal</Typography>
                    <Typography sx={{ fontWeight: 700 }}>₹{formatPrice(calculateTotal())}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Service Fee</Typography>
                    <Typography sx={{ fontWeight: 700 }}>₹40.00</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: "primary.main" }}>
                      ₹{(parseFloat(formatPrice(calculateTotal())) + 40).toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  disableElevation
                  size="large"
                  onClick={handleProceedToPayment}
                  sx={{ 
                    borderRadius: "100px", 
                    py: 2, 
                    fontWeight: 900, 
                    bgcolor: "secondary.main",
                    mb: 2,
                    "&:hover": { bgcolor: "secondary.dark" }
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="text"
                  fullWidth
                  onClick={() => navigate("/Explore")}
                  sx={{ 
                    color: "text.secondary", 
                    fontWeight: 700, 
                    fontSize: "0.85rem",
                    "&:hover": { color: "primary.main", bgcolor: "transparent" } 
                  }}
                >
                  Continue Browsing
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default CartPage;
