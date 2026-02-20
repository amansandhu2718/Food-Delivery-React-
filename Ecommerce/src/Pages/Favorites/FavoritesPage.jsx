import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Container,
    Grid,
    CircularProgress,
    Alert,
    useTheme,
} from "@mui/material";
import api from "../../utils/api";
import { GetColors } from "../../utils/Theme";
import FoodItem from "../../Components/FoodItem";

function FavoritesPage() {
    const theme = useTheme();
    const colors = GetColors(theme.palette.mode);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/favorites");
            setFavorites(res.data || []);
        } catch (err) {
            console.error("Failed to fetch favorites", err);
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
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight={700} mb={4}>
                My Favorites
            </Typography>

            {favorites.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: "8px" }}>
                    You haven't added any favorite items yet. Explore some delicious food and mark them as favorites!
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {favorites.map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                            <FoodItem dish={item} onFavoriteToggle={fetchFavorites} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default FavoritesPage;
