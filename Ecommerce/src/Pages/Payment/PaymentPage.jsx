import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  Grid,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import api from "../../utils/api";
import { GetColors } from "../../utils/Theme";

function PaymentPage() {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

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

  const formatPrice = (paise) => {
    return (paise / 100).toFixed(2);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const handlePayment = async () => {
    // Basic validation
    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
        alert("Please fill all card details");
        return;
      }
    }

    try {
      // Get cart items to create transaction
      const cartRes = await api.get("/api/cart");
      const cartItems = cartRes.data;

      if (cartItems.length === 0) {
        alert("Cart is empty");
        return;
      }

      // Create transaction from cart items
      const transactionData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        promo: null, // You can add promo code logic here
      };

      await api.post("/api/transactions", transactionData);

      // Clear cart and redirect
      await api.delete("/api/cart");
      alert("Payment successful! Order placed.");
      navigate("/orders");
    } catch (err) {
      console.error("Payment failed", err);
      alert("Payment failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Your cart is empty. Add items to proceed with payment.
        </Alert>
        <Button variant="contained" onClick={() => navigate("/cart")}>
          Go to Cart
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Payment
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ boxShadow: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={3}>
                Payment Method
              </Typography>

              <FormControl component="fieldset">
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <CreditCardIcon />
                        <Typography>Credit/Debit Card</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="upi"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <PaymentIcon />
                        <Typography>UPI</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="netbanking"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccountBalanceIcon />
                        <Typography>Net Banking</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>

              {paymentMethod === "card" && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                    }
                    placeholder="1234 5678 9012 3456"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={cardDetails.cardName}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cardName: e.target.value })
                    }
                    sx={{ mb: 2 }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        value={cardDetails.expiryDate}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, expiryDate: e.target.value })
                        }
                        placeholder="MM/YY"
                        autoComplete="off"
                        inputProps={{ autoComplete: 'off' }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, cvv: e.target.value })
                        }
                        placeholder="123"
                        type="password"
                        autoComplete="new-password"
                        inputProps={{ autoComplete: 'new-password' }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {paymentMethod === "upi" && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="UPI ID"
                    placeholder="yourname@upi"
                    sx={{ mb: 2 }}
                  />
                  <Alert severity="info">
                    You will be redirected to your UPI app for payment
                  </Alert>
                </Box>
              )}

              {paymentMethod === "netbanking" && (
                <Box sx={{ mt: 3 }}>
                  <Alert severity="info">
                    You will be redirected to your bank's website for payment
                  </Alert>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ boxShadow: 3, position: "sticky", top: 20 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {cartItems.map((item) => (
                <Box key={item.id} display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    ₹{formatPrice(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2">₹{formatPrice(calculateTotal())}</Typography>
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
                onClick={handlePayment}
                sx={{ mb: 2 }}
              >
                Pay ₹{(parseFloat(formatPrice(calculateTotal())) + 40).toFixed(2)}
              </Button>

              <Button variant="outlined" fullWidth onClick={() => navigate("/cart")}>
                Back to Cart
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PaymentPage;
