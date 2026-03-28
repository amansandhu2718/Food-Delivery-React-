import { useState, useMemo } from "react";
import {
  Box,
  Chip,
  Rating,
  Typography,
  Container,
  Stack,
  Divider,
  InputBase,
  colors,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

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

import DishCard from "../../Components/DishCard";

function FoodPage() {
  const theme = useTheme();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minRating, setMinRating] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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

      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesName = dish.name?.toLowerCase().includes(lowerSearch);
        const matchesCategory = dish.category
          ?.toLowerCase()
          .includes(lowerSearch);
        if (!matchesName && !matchesCategory) return false;
      }

      return true;
    });
  }, [dishesData, selectedCategories, minRating, searchTerm]);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* HERO */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container
          maxWidth="xxl"
          sx={{ px: { xs: 2, md: 8 }, position: "relative", zIndex: 1 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "-0.04em",
              mb: 2,
            }}
          >
            Summer Specialties
          </Typography>
          <Typography
            sx={{
              opacity: 0.9,
              fontWeight: 700,
              letterSpacing: "0.2em",
              fontSize: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            DISCOVER THE SEASON'S FINEST PLATING
          </Typography>
        </Container>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            background: "radial-gradient(#ffffff 2px, transparent 2px)",
            backgroundSize: "32px 32px",
          }}
        />
      </Box>

      <Container
        maxWidth="xxl"
        sx={{ mt: -4, px: { xs: 2, md: 8 }, position: "relative", zIndex: 10 }}
      >
        {/* FILTER PANEL */}
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 4,
            borderRadius: "32px",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 20px 50px rgba(0,0,0,0.5)"
                : "0 20px 50px rgba(0,0,0,0.08)",
            border:
              "1px solid " +
              (theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)"),
            mb: 6,
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Box
              sx={{
                flex: 1,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                borderRadius: "100px",
                px: 3,
                height: "56px",
                display: "flex",
                alignItems: "center",
                transition: "all 0.3s ease",
                border: "1px solid transparent",
                "&:focus-within": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "white",
                  borderColor: "primary.main",
                  boxShadow: "0 0 0 4px " + theme.palette.primary.main + "20",
                },
              }}
            >
              <SearchIcon sx={{ color: "text.secondary", mr: 2 }} />
              <InputBase
                placeholder="Search for your favorite dishes or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  flex: 1,
                  fontSize: "1rem",
                  fontWeight: 600,
                  "& input::placeholder": {
                    color: "text.secondary",
                    opacity: 0.7,
                  },
                }}
              />
            </Box>
          </Stack>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {/* CATEGORY FILTERS */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 900,
                  color: "text.secondary",
                  letterSpacing: "0.1em",
                  display: "block",
                  mb: 2,
                }}
              >
                CATEGORIES
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 1.5 }}
              >
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
                            : [...prev, cat],
                        )
                      }
                      sx={chipStyle(active, theme)}
                    />
                  );
                })}
              </Stack>
            </Box>

            {/* RATING FILTER */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 900,
                  color: "text.secondary",
                  letterSpacing: "0.1em",
                  display: "block",
                  mb: 2,
                }}
              >
                MINIMUM RATING
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 1.5 }}
              >
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
                      sx={chipStyle(active, theme)}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>

          {/* APPLIED FILTERS */}
          {(selectedCategories.length > 0 || minRating) && (
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid " + theme.palette.divider,
              }}
            >
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {selectedCategories.map((cat) => (
                  <AppliedChip
                    key={cat}
                    label={cat.toUpperCase()}
                    onDelete={() =>
                      setSelectedCategories((prev) =>
                        prev.filter((c) => c !== cat),
                      )
                    }
                  />
                ))}
                {minRating && (
                  <AppliedChip
                    label={`RATING: ${minRating}+`}
                    onDelete={() => setMinRating(null)}
                  />
                )}
              </Stack>
            </Box>
          )}
        </Box>

        {/* FOOD GRID */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Exploration Gallery
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontWeight: 700,
              fontSize: "0.85rem",
              opacity: 0.6,
            }}
          >
            {filteredDishes.length} SPECIALTIES FOUND
          </Typography>
        </Box>

        {filteredDishes.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 15,
              bgcolor: "background.paper",
              borderRadius: "32px",
              border: "1px dashed " + theme.palette.divider,
            }}
          >
            <Typography
              variant="h5"
              color="text.secondary"
              fontWeight={800}
              sx={{ opacity: 0.5 }}
            >
              No dishes found matching your filters.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(6, 1fr)",
              },
              gap: 4,
              pb: 8,
            }}
          >
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                {...dish}
                isFavorite={favorites.includes(dish.id)}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

const AppliedChip = ({ label, onDelete }) => (
  <Chip
    label={label}
    onDelete={onDelete}
    deleteIcon={<CloseIcon sx={{ fontSize: "14px !important" }} />}
    sx={{
      bgcolor: "secondary.main",
      color: "white",
      fontWeight: 900,
      fontSize: "0.6rem",
      height: "28px",
      letterSpacing: "0.05em",
      "& .MuiChip-deleteIcon": {
        color: "white !important",
        "&:hover": { opacity: 0.8 },
      },
    }}
  />
);

const chipStyle = (active, theme) => ({
  bgcolor: active ? theme.palette.primary.main : "transparent",
  color: active ? "white" : "inherit",
  fontWeight: 600,
  fontSize: "0.75rem",
  border: active ? "none" : `1px solid ${theme.palette.divider}`,
  "&:hover": {
    bgcolor: active ? theme.palette.primary.dark : "action.hover",
  },
});

export default FoodPage;
