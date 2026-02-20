import { useState, useMemo } from "react";
import {
  Box,
  Chip,
  Rating,
  Typography,
  Container,
  Stack,
  Divider,
  colors,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import FoodItem from "../../Components/FoodItem";
import { GetColors } from "../../utils/Theme";
import { useEffect } from "react";

/* =======================
   DATA
======================= */

// const dishesData = [
//   {
//     id: 1,
//     restaurantId: "RES_101",
//     name: "Rajma Chawal",
//     image: "https://images.unsplash.com/photo-1628294895950-9805252327bc",
//     rating: 4.5,
//     category: "Main Course",
//   },
//   {
//     id: 2,
//     restaurantId: "RES_102",
//     name: "Veg Burger",
//     image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
//     rating: 4.2,
//     category: "Fast Food",
//   },
//   {
//     id: 3,
//     restaurantId: "RES_103",
//     name: "Pizza",
//     image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
//     rating: 4.6,
//     category: "Italian",
//   },
//   {
//     id: 4,
//     restaurantId: "RES_104",
//     name: "Chowmein",
//     image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
//     rating: 4.3,
//     category: "Chinese",
//   },
//   {
//     id: 5,
//     restaurantId: "RES_105",
//     name: "Momos",
//     image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
//     rating: 4.7,
//     category: "Chinese",
//   },
//   {
//     id: 6,
//     restaurantId: "RES_106",
//     name: "Butter Chicken",
//     image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
//     rating: 4.8,
//     category: "Main Course",
//   },
//   {
//     id: 7,
//     restaurantId: "RES_101",
//     name: "Rajma Chawal",
//     image: "https://images.unsplash.com/photo-1628294895950-9805252327bc",
//     rating: 4.5,
//     category: "Main Course",
//   },
//   {
//     id: 8,
//     restaurantId: "RES_102",
//     name: "Veg Burger",
//     image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
//     rating: 4.2,
//     category: "Fast Food",
//   },
//   {
//     id: 9,
//     restaurantId: "RES_103",
//     name: "Pizza",
//     image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
//     rating: 4.6,
//     category: "Italian",
//   },
//   {
//     id: 10,
//     restaurantId: "RES_104",
//     name: "Chowmein",
//     image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
//     rating: 4.3,
//     category: "Chinese",
//   },
//   {
//     id: 11,
//     restaurantId: "RES_105",
//     name: "Momos",
//     image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
//     rating: 4.7,
//     category: "Chinese",
//   },
//   {
//     id: 12,
//     restaurantId: "RES_106",
//     name: "Butter Chicken",
//     image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
//     rating: 4.8,
//     category: "Main Course",
//   },
// ];

const categories = ["Main Course", "Fast Food", "Chinese", "Italian"];
const ratingOptions = [4, 4.5];

/* =======================
   COMPONENT
======================= */

function FoodPage() {
  const theme = useTheme();
  let colors = GetColors(theme.palette.mode);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minRating, setMinRating] = useState(null);
  const [dishesData, setDishesData] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const api = (await import("../../utils/api")).default;
        const res = await api.get("/api/products");
        setDishesData(res.data || []);
      } catch (err) {
        console.error("Error fetching dishes:", err);
      }
    };
    const fetchFavorites = async () => {
      try {
        const api = (await import("../../utils/api")).default;
        const res = await api.get("/api/favorites");
        setFavorites(res.data.map((f) => f.id));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };
    fetchDishes();
    fetchFavorites();
  }, []);

  const filteredDishes = useMemo(() => {
    return dishesData.filter((dish) => {
      if (
        selectedCategories.length &&
        !selectedCategories.includes(dish.category)
      )
        return false;

      if (minRating && dish.rating < minRating) return false;

      return true;
    });
  }, [dishesData, selectedCategories, minRating]);

  /* =======================
     UI
  ======================= */

  return (
    <Box
      sx={{
        paddingLeft: 2,
        paddingRight: 2,
      }}
    >
      <Box
        sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default }}
      >
        {/* HERO */}
        <Box
          sx={{
            py: { xs: 4, md: 6 },
            textAlign: "center",
            background: "linear-gradient(135deg, #3f2aa0 0%, #ff8a65 100%)",
            color: "#fff",
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Find Your Favorite Food
          </Typography>
          <Typography sx={{ mt: 1, opacity: 0.9 }}>
            Discover dishes from top restaurants near you
          </Typography>
        </Box>

        <Container maxWidth="lg" sx={{ mt: -4 }}>
          {/* FILTER PANEL */}
          <Box
            sx={{
              bgcolor: theme.palette.background.paper,
              p: 2.5,
              borderRadius: 2,
              boxShadow: 3,
              mb: 3,
            }}
          >
            {/* CATEGORY FILTERS */}
            <Typography fontWeight={600} mb={1}>
              Categories
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <Chip
                    key={cat}
                    label={cat}
                    clickable
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(cat)
                          ? prev.filter((c) => c !== cat)
                          : [...prev, cat]
                      )
                    }
                    sx={chipStyle(active, colors)}
                  />
                );
              })}
            </Stack>

            {/* RATING FILTER */}
            <Typography fontWeight={600} mb={1}>
              Rating
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {ratingOptions.map((rate) => {
                const active = minRating === rate;
                return (
                  <Chip
                    key={rate}
                    label={`⭐ ${rate}+`}
                    clickable
                    onClick={() =>
                      setMinRating((prev) => (prev === rate ? null : rate))
                    }
                    sx={chipStyle(active, colors)}
                  />
                );
              })}
            </Stack>

            {/* APPLIED FILTERS */}
            {(selectedCategories.length || minRating) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedCategories.map((cat) => (
                    <Chip
                      key={cat}
                      label={cat}
                      onDelete={() =>
                        setSelectedCategories((prev) =>
                          prev.filter((c) => c !== cat)
                        )
                      }
                      deleteIcon={<CloseIcon />}
                    // color="primary"
                    />
                  ))}

                  {minRating && (
                    <Chip
                      label={`Rating ≥ ${minRating}`}
                      onDelete={() => setMinRating(null)}
                      deleteIcon={<CloseIcon />}
                    // color="primary"
                    />
                  )}
                </Stack>
              </>
            )}
          </Box>

          {/* FOOD GRID */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(3, 1fr)",
                sm: "repeat(4, 1fr)",
                md: "repeat(6, 1fr)",
              },
              gap: 2,
              pb: 4,
            }}
          >
            {filteredDishes.map((dish) => (
              <FoodItem
                key={dish.id}
                dish={{ ...dish, isFavorite: favorites.includes(dish.id) }}
              />
            ))}
          </Box>

          {filteredDishes.length === 0 && (
            <Typography textAlign="center" color="text.secondary">
              No dishes found matching your filters.
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
}

const chipStyle = (active, colors) => ({
  bgcolor: active ? colors.greenAccent[500] : "transparent",
  color: active ? colors.Font[100] : "inherit",
  fontWeight: 600,
  fontSize: "0.75rem",
  border: active ? "none" : `1px solid ${colors.Font[400]}`,
  "&:hover": {
    bgcolor: active ? colors.greenAccent[600] : "action.hover",
  },
});

export default FoodPage;
