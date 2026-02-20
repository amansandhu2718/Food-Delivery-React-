import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import api from "../../utils/api";
import RestaurantCard from "../../Components/RestaurantCard";

function FoodRestaurantsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [restaurants, setRestaurants] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [restaurantsRes, productsRes] = await Promise.all([
        api.get(`/api/products/${productId}/restaurants`),
        api.get("/api/products"),
      ]);

      setRestaurants(restaurantsRes.data || []);
      const foundProduct = productsRes.data.find((p) => p.id === productId);
      setProduct(foundProduct);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #3f2aa0 0%, #ff8a65 100%)",
          color: "#fff",
          py: 3,
        }}
      >
        <Container>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: "#fff" }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Restaurants serving {product?.name || "this item"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} found
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        {restaurants.length === 0 ? (
          <Alert severity="info">No restaurants found serving this item.</Alert>
        ) : (
          <Grid container spacing={3}>
            {restaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default FoodRestaurantsPage;
