import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Button,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
  useTheme,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import api from "../../utils/api";

function MenuPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchRestaurant();
    fetchMenu();
    fetchCart();
    fetchFavorites();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const res = await api.get(`/api/restaurants/${restaurantId}`);
      setRestaurant(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await api.get(`/api/restaurants/${restaurantId}/menu`);
      setMenuItems(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load menu");
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart");
      const cartMap = {};
      res.data.forEach((item) => {
        cartMap[item.productId] = item.quantity;
      });
      setCart(cartMap);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/api/favorites");
      setFavorites(res.data.map((f) => `${f.id}-${f.restaurantId}`));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (e, productId) => {
    e.stopPropagation();
    try {
      await api.post("/api/favorites/toggle", { productId, restaurantId });
      fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (productId) => {
    try {
      await api.post("/api/cart/add", {
        productId,
        restaurantId,
        quantity: 1,
      });
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const cartItem = await api.get("/api/cart");
      const item = cartItem.data.find((i) => i.productId === productId);
      if (!item) return;

      if (newQuantity === 0) {
        await api.delete(`/api/cart/item/${item.id}`);
      } else {
        await api.put(`/api/cart/item/${item.id}`, { quantity: newQuantity });
      }
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (paise) => {
    return `₹${(paise / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 10 }}>
        <Alert severity="error" sx={{ borderRadius: "16px" }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* ---------------- RESTAURANT HERO ---------------- */}
      <Box
        sx={{
          position: "relative",
          minHeight: "450px",
          display: "flex",
          alignItems: "flex-end",
          pb: 10,
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={
            restaurant?.image
              ? `${restaurant.image}${restaurant.image.includes("?") ? "&" : "?"}auto=format&fit=crop&w=1200&q=70`
              : "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=70"
          }
          alt={restaurant?.name || "Restaurant"}
          loading="lazy"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 10s ease",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
          }}
        />

        <Container
          maxWidth="xxl"
          sx={{ px: { xs: 2, md: 8 }, position: "relative", zIndex: 1 }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              mb: 4,
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.05)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box sx={{ maxWidth: 900 }}>
            <Stack
              direction="row"
              spacing={2}
              sx={{ mb: 3, alignItems: "center" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "secondary.main",
                  color: "white",
                  px: 2,
                  py: 0.7,
                  borderRadius: "100px",
                  fontSize: "0.7rem",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  boxShadow: "0 8px 16px rgba(249, 115, 22, 0.4)",
                  lineHeight: 1,
                }}
              >
                {restaurant?.isOpen ? "Live Now" : "Resting"}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  px: 1.5,
                  py: 0.7,
                  borderRadius: "100px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  lineHeight: 1,
                }}
              >
                <StarIcon sx={{ color: "#FFB800", fontSize: 16 }} />
                <Typography
                  sx={{ fontWeight: 900, fontSize: "0.85rem", lineHeight: 1 }}
                >
                  {restaurant?.rating || "4.5"}
                </Typography>
              </Box>
            </Stack>

            <Typography
              variant="h1"
              sx={{
                color: "white",
                fontSize: { xs: "3rem", md: "5rem" },
                fontWeight: 900,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                mb: 1,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {restaurant?.name || restaurant?.title}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: { xs: "1rem", md: "1.25rem" },
                fontWeight: 600,
                mb: 4,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {Array.isArray(restaurant?.cuisine)
                ? restaurant.cuisine.join(" · ")
                : restaurant?.cuisine}
            </Typography>

            <Stack
              direction="row"
              spacing={4}
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.8rem",
                fontWeight: 800,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                LOCATION:{" "}
                {restaurant?.location?.toUpperCase() || "CENTRAL DISTRICT"}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                PREP TIME: {restaurant?.deliveryTime || "30-40"} MINS
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xxl" sx={{ py: 10, px: { xs: 2, md: 8 } }}>
        <Box
          sx={{
            mb: 6,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "primary.main",
                fontWeight: 900,
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                mb: 0.5,
              }}
            >
              Catalogue
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800 }}>
              Seasonal Menu
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "text.secondary",
              fontWeight: 800,
              fontSize: "0.75rem",
              opacity: 0.4,
            }}
          >
            {menuItems.length} COLLECTIONS
          </Typography>
        </Box>

        {menuItems.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              bgcolor: "background.paper",
              borderRadius: "48px",
              border: "1px dashed " + theme.palette.divider,
            }}
          >
            <Typography
              color="text.secondary"
              fontWeight={700}
              fontSize="1.1rem"
            >
              The collection is currently being curated.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 5,
            }}
          >
            {menuItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  borderRadius: "40px",
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  border:
                    "1px solid " +
                    (theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)"),
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-12px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 25px 50px rgba(0,0,0,0.5)"
                        : "0 25px 50px rgba(0,0,0,0.06)",
                  },
                }}
              >
                <Box
                  sx={{ position: "relative", pt: "85%", overflow: "hidden" }}
                >
                  <Box
                    component="img"
                    src={
                      item.image
                        ? `${item.image}${item.image.includes("?") ? "&" : "?"}auto=format&fit=crop&w=500&q=60`
                        : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60"
                    }
                    alt={item.name}
                    loading="lazy"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    onClick={(e) => toggleFavorite(e, item.id)}
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(0,0,0,0.6)"
                          : "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(12px)",
                      color: favorites.includes(`${item.id}-${restaurantId}`)
                        ? "#ff4d4d"
                        : "text.secondary",
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                  >
                    {favorites.includes(`${item.id}-${restaurantId}`) ? (
                      <FavoriteIcon fontSize="small" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    p: 4,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      mb: 1.5,
                      lineHeight: 1.2,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      flexGrow: 1,
                      fontWeight: 500,
                      lineHeight: 1.7,
                      opacity: 0.8,
                    }}
                  >
                    {item.description ||
                      "A masterfully crafted selection from our head chef."}
                  </Typography>

                  <Divider sx={{ mb: 3, opacity: 0.1 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: "primary.main",
                        fontSize: "1.5rem",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {formatPrice(item.price)}
                    </Typography>

                    {cart[item.id] ? (
                      <Stack
                        direction="row"
                        alignItems="center"
                        bgcolor={
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(5, 150, 105, 0.05)"
                        }
                        borderRadius="100px"
                        px={1.5}
                        py={0.5}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item.id, cart[item.id] - 1)
                          }
                          sx={{ color: "primary.main" }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{ fontWeight: 900, mx: 1.5, fontSize: "1rem" }}
                        >
                          {cart[item.id]}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item.id, cart[item.id] + 1)
                          }
                          sx={{ color: "primary.main" }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ) : (
                      <Button
                        variant="contained"
                        disableElevation
                        onClick={() => addToCart(item.id)}
                        disabled={!restaurant?.isOpen}
                        sx={{
                          borderRadius: "100px",
                          px: 4,
                          py: 1,
                          fontWeight: 900,
                          bgcolor: "secondary.main",
                          "&:hover": { bgcolor: "secondary.dark" },
                        }}
                      >
                        Add Item
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default MenuPage;
