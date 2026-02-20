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
    Button,
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Stack,
    useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import api from "../../utils/api";
import { GetColors } from "../../utils/Theme";

function MenuPage() {
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = GetColors(theme.palette.mode);

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
            setError("Failed to load restaurant");
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
            console.error(err);
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
            console.error("Failed to fetch cart", err);
        }
    };

    const fetchFavorites = async () => {
        try {
            const res = await api.get("/api/favorites");
            setFavorites(res.data.map(f => `${f.id}-${f.restaurantId}`));
        } catch (err) {
            console.error("Failed to fetch favorites", err);
        }
    };

    const toggleFavorite = async (e, productId) => {
        e.stopPropagation();
        try {
            await api.post("/api/favorites/toggle", { productId, restaurantId });
            fetchFavorites();
        } catch (err) {
            console.error("Failed to toggle favorite", err);
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
            console.error("Failed to add to cart", err);
            alert("Failed to add item to cart");
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
            console.error("Failed to update cart", err);
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
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
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
                                {restaurant?.name || restaurant?.title}
                            </Typography>
                            {restaurant?.cuisine && (
                                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                    {Array.isArray(restaurant.cuisine)
                                        ? restaurant.cuisine.join(", ")
                                        : restaurant.cuisine}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container sx={{ py: 4 }}>
                {/* Restaurant Info */}
                {restaurant && (
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
                            {restaurant.image && (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={restaurant.image}
                                    alt={restaurant.name || restaurant.title}
                                    sx={{ width: { xs: "100%", md: "300px" }, objectFit: "cover" }}
                                />
                            )}
                            <CardContent sx={{ flex: 1 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    {restaurant.rating && (
                                        <Rating value={restaurant.rating} precision={0.1} readOnly />
                                    )}
                                    <Chip
                                        label={restaurant.isOpen ? "Open Now" : "Closed"}
                                        color={restaurant.isOpen ? "success" : "default"}
                                        size="small"
                                    />
                                </Box>
                                {restaurant.location && (
                                    <Typography variant="body2" color="text.secondary" mb={1}>
                                        📍 {restaurant.location}
                                    </Typography>
                                )}
                                {restaurant.deliveryTime && (
                                    <Typography variant="body2" color="text.secondary">
                                        ⏱️ {restaurant.deliveryTime} mins delivery
                                    </Typography>
                                )}
                            </CardContent>
                        </Box>
                    </Card>
                )}

                {/* Menu Items */}
                <Typography variant="h5" fontWeight={600} mb={3}>
                    Menu
                </Typography>

                {menuItems.length === 0 ? (
                    <Alert severity="info">No menu items available</Alert>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 3,
                        }}
                    >
                        {menuItems.map((item) => (
                            <Card key={item.id} sx={{ boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
                                {item.image && (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={item.image}
                                        alt={item.name}
                                        sx={{ objectFit: "cover" }}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" fontWeight={600}>
                                            {item.name}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => toggleFavorite(e, item.id)}
                                            sx={{
                                                color: favorites.includes(`${item.id}-${restaurantId}`) ? colors.redAccent[500] : "action.disabled"
                                            }}
                                        >
                                            {favorites.includes(`${item.id}-${restaurantId}`) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                        </IconButton>
                                    </Box>
                                    {item.rating && (
                                        <Rating
                                            value={item.rating}
                                            precision={0.1}
                                            readOnly
                                            size="small"
                                            sx={{ mb: 1 }}
                                        />
                                    )}
                                    {item.category && (
                                        <Chip
                                            label={item.category}
                                            size="small"
                                            sx={{ mb: 1 }}
                                        />
                                    )}
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mt={2}
                                    >
                                        <Typography variant="h6" color="primary">
                                            {formatPrice(item.price)}
                                        </Typography>
                                        {cart[item.id] ? (
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        updateQuantity(item.id, cart[item.id] - 1)
                                                    }
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography>{cart[item.id]}</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        updateQuantity(item.id, cart[item.id] + 1)
                                                    }
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Stack>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={() => addToCart(item.id)}
                                                disabled={!restaurant?.isOpen}
                                            >
                                                Add
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
}

export default MenuPage;
