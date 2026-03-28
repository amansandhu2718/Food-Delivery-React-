import React from "react";
import { Box, Container, Typography, Button, useTheme } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MealCard from "./MealCard";

const meals = [
  {
    id: 101,
    restaurantId: 1,
    name: "Fruit Cream",
    restaurant: "Sethi Ice Cream & Shakes",
    rating: 4.3,
    deliveryTime: "20-25 mins",
    price: 55,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=60",
    tag: "Popular",
  },
  {
    id: 102,
    restaurantId: 2,
    name: "Chicken Steam Momos",
    restaurant: "Wow! Momo",
    rating: 4.4,
    deliveryTime: "25-30 mins",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=400&q=60",
    tag: "Popular",
  },
  {
    id: 103,
    restaurantId: 3,
    name: "Veg Burger Combo",
    restaurant: "Burger King",
    rating: 4.1,
    deliveryTime: "15-20 mins",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=60",
    tag: "Bestseller",
  },
  {
    id: 104,
    restaurantId: 1,
    name: "Paneer Tikka Roll",
    restaurant: "Roll Express",
    rating: 4.5,
    deliveryTime: "20-25 mins",
    price: 79,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: 105,
    restaurantId: 2,
    name: "Chocolate Cake Slice",
    restaurant: "Sweet Tooth Bakery",
    rating: 4.6,
    deliveryTime: "30-35 mins",
    price: 75,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=60",
    tag: "Popular",
  },
  {
    id: 106,
    restaurantId: 3,
    name: "Classic Cold Coffee",
    restaurant: "Café Starter",
    rating: 4.2,
    deliveryTime: "15-20 mins",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=60",
  },
];


const MealsSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8, bgcolor: "background.default", transition: "background-color 0.3s ease" }}>
      <Container maxWidth="xxl" sx={{ px: { xs: 2, md: 8 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 5,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 1.5,
                py: 0.5,
                borderRadius: "100px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(1, 128, 41, 0.05)",
                color: "primary.main",
                fontSize: "0.65rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                mb: 1.5,
                border: "1px solid " + (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(1, 128, 41, 0.1)"),
              }}
            >
              Directory
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              Everyday Luxuries
            </Typography>
          </Box>

          <Button
            variant="text"
            sx={{
              color: "text.secondary",
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              "&:hover": { color: "primary.main", bgcolor: "transparent" },
            }}
            endIcon={<ChevronRight sx={{ fontSize: 16 }} />}
            onClick={() => navigate("/explore")}
          >
            See All Journals
          </Button>
        </Box>

        {/* Grid Layout */}
        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, md: 4 },
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(6, 1fr)",
            },
          }}
        >
          {meals.map((meal, index) => (
            <MealCard key={index} {...meal} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default MealsSection;
