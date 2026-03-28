import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Stack,
  InputAdornment,
  Paper,
  useTheme,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  FaPizzaSlice,
  FaHamburger,
  FaIceCream,
  FaLeaf,
  FaDrumstickBite,
  FaFish,
  FaCheese,
  FaHotdog,
} from "react-icons/fa";
import {
  GiSandwich,
  GiNoodles,
  GiTacos,
  GiBowlOfRice,
  GiChickenOven,
  GiCupcake,
} from "react-icons/gi";
import {
  MdOutlineSoupKitchen,
  MdRamenDining,
  MdFastfood,
} from "react-icons/md";
import { FiCoffee } from "react-icons/fi";
import { TbSalad } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import SwiggyFoodCard from "../../Components/SwiggyFoodCard";
import DishCard from "../../Components/DishCard";
import RestaurantAppBar from "../../Components/RestaurantAppBar";
import MealsSection from "../../Components/MelsSection";
import Hero from "../../Components/HeroSection";
import api from "../../utils/api";

const restaurants = [
  {
    id: 1,
    name: "Bella Napoli",
    cuisine: "Italian · Pizza",
    rating: 4.8,
    deliveryTime: "20-30",
    deliveryFee: "Free",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 2,
    name: "Sakura House",
    cuisine: "Japanese · Sushi",
    rating: 4.9,
    deliveryTime: "25-35",
    deliveryFee: "₹60",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 3,
    name: "Spice Route",
    cuisine: "Indian · Curry",
    rating: 4.6,
    deliveryTime: "30-40",
    deliveryFee: "Free",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 4,
    name: "The Burger Club",
    cuisine: "American · Burgers",
    rating: 4.5,
    deliveryTime: "20-30",
    deliveryFee: "Free",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 5,
    name: "Sushi Zen",
    cuisine: "Japanese · Sushi",
    rating: 4.7,
    deliveryTime: "25-35",
    deliveryFee: "₹45",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 6,
    name: "Evergreen Salads",
    cuisine: "Healthy · Salads",
    rating: 4.4,
    deliveryTime: "15-25",
    deliveryFee: "Free",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 7,
    name: "Cafe Coffee Day",
    cuisine: "Beverages · Coffee",
    rating: 4.2,
    deliveryTime: "10-20",
    deliveryFee: "₹30",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 8,
    name: "Taco Bell",
    cuisine: "Mexican · Tacos",
    rating: 4.3,
    deliveryTime: "20-30",
    deliveryFee: "Free",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
];

const featuredDishes = [
  {
    id: 1,
    name: "Margherita Pizza",
    restaurant: "Bella Napoli",
    restaurantId: 1,
    price: 349,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Dragon Roll",
    restaurant: "Sakura House",
    restaurantId: 2,
    price: 499,
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=400&q=80",
    tag: "New",
  },
  {
    id: 3,
    name: "Crispy Burger",
    restaurant: "Burger Club",
    restaurantId: 4,
    price: 199,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
    tag: "Bestseller",
  },
  {
    id: 4,
    name: "Avocado Toast",
    restaurant: "Evergreen",
    restaurantId: 6,
    price: 249,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80",
    tag: "New",
  },
];

const categories = [
  { icon: <FaPizzaSlice />, label: "All" },
  { icon: <GiSandwich />, label: "Rolls" },
  { icon: <FaHamburger />, label: "Burgers" },
  { icon: <MdFastfood />, label: "Fast Food" },
  { icon: <FaDrumstickBite />, label: "Chicken" },
  { icon: <GiChickenOven />, label: "BBQ" },
  { icon: <GiTacos />, label: "Mexican" },
  { icon: <FaFish />, label: "Seafood" },
  { icon: <GiBowlOfRice />, label: "Rice Bowls" },
  { icon: <MdRamenDining />, label: "Ramen" },
  { icon: <GiNoodles />, label: "Noodles" },
  { icon: <MdOutlineSoupKitchen />, label: "Momos" },
  { icon: <FaCheese />, label: "Italian" },
  { icon: <TbSalad />, label: "Salads" },
  { icon: <FaLeaf />, label: "Healthy" },
  { icon: <GiCupcake />, label: "Desserts" },
  { icon: <FaIceCream />, label: "Ice Cream" },
  { icon: <FiCoffee />, label: "Café" },
];

const Categories = ({ active, setActive }) => {
  const theme = useTheme();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth / 2;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Box sx={{ py: 6, bgcolor: "background.default", position: "relative" }}>
      <Container maxWidth="xxl" sx={{ px: { xs: 2, md: 8 } }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
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
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(1, 128, 41, 0.05)",
                color: "primary.main",
                fontSize: "0.65rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                mb: 1.5,
                border:
                  "1px solid " +
                  (theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(1, 128, 41, 0.1)"),
              }}
            >
              Directory
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Curated Cuisines
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={() => scroll("left")}
              sx={{ mr: 1, border: "1px solid " + theme.palette.divider }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() => scroll("right")}
              sx={{ border: "1px solid " + theme.palette.divider }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ position: "relative" }}>
          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              pt: 2, // Fix for hover clipping
              pb: 2,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {categories.map((cat) => {
              const isActive = active === cat.label;
              return (
                <Box
                  key={cat.label}
                  onClick={() => setActive(cat.label)}
                  sx={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 4,
                    py: 2,
                    borderRadius: "100px",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    bgcolor: isActive ? "primary.main" : "background.paper",
                    color: isActive ? "white" : "text.secondary",
                    border: isActive
                      ? "1px solid transparent"
                      : "1px solid " +
                        (theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.05)"),
                    boxShadow: isActive
                      ? "0 10px 20px rgba(1, 128, 41, 0.2)"
                      : "0 2px 4px rgba(0,0,0,0.02)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      bgcolor: isActive
                        ? "primary.dark"
                        : theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(1, 128, 41, 0.04)",
                      borderColor: isActive ? "transparent" : "primary.main",
                      boxShadow: isActive
                        ? "0 15px 30px rgba(1, 128, 41, 0.3)"
                        : "0 8px 16px rgba(0,0,0,0.05)",
                    },
                    "&:active": { transform: "scale(0.95)" },
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 20,
                      display: "flex",
                      transition: "all 0.3s ease",
                      transform: isActive ? "scale(1.1)" : "none",
                    }}
                  >
                    {cat.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: isActive ? 900 : 700,
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cat.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const Browse = () => {
  const navigate = useNavigate();
  const [restaurantsApi, setRestaurantsApi] = useState([]);
  const [featuredDishesApi, setFeaturedDishesApi] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRestaurants, resDishes] = await Promise.all([
          api.get("/api/restaurants"),
          api.get("/api/products"),
        ]);

        const mappedRestaurants = (resRestaurants.data || []).map((r) => ({
          id: r.id,
          name: r.title || r.name,
          cuisine: r.cuisine || [],
          rating: r.rating || 0,
          deliveryTime: r.delivery_time || "30-40",
          deliveryFee: r.price_for_two ? `₹${r.price_for_two}` : "Free",
          image:
            r.image ||
            r.image_url ||
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
          featured: r.hasOffer || false,
        }));
        setRestaurantsApi(mappedRestaurants);

        const mappedDishes = (resDishes.data || []).map((d) => ({
          id: d.id,
          name: d.title || d.name,
          restaurant: d.restaurantName || "Featured Restaurant",
          restaurantId: d.restaurantId,
          price: d.price ? (d.price / 100).toFixed(2) : "12.99",
          image:
            d.image ||
            d.image_url ||
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
          tag: d.hasOffer ? "Offer" : "Bestseller",
          category: d.category || "",
        }));
        setFeaturedDishesApi(mappedDishes);
      } catch (err) {
        console.error("Error fetching browse data:", err);
      }
    };
    fetchData();
  }, []);

  const displayRestaurants =
    restaurantsApi.length > 0 ? restaurantsApi : restaurants;
  const displayDishes =
    featuredDishesApi.length > 0 ? featuredDishesApi : featuredDishes;

  const filteredRestaurants =
    activeCategory === "All"
      ? displayRestaurants
      : displayRestaurants.filter((r) =>
          (Array.isArray(r.cuisine) ? r.cuisine : [r.cuisine]).some((c) =>
            c.toLowerCase().includes(activeCategory.toLowerCase()),
          ),
        );

  const filteredDishes =
    activeCategory === "All"
      ? displayDishes
      : displayDishes.filter(
          (d) =>
            d.category?.toLowerCase().includes(activeCategory.toLowerCase()) ||
            d.name?.toLowerCase().includes(activeCategory.toLowerCase()),
        );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Hero />
      <Categories active={activeCategory} setActive={setActiveCategory} />

      <Container maxWidth="xxl" sx={{ py: -5, px: { xs: 2, md: 8 } }}>
        <Box
          sx={{
            mb: 5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
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
                bgcolor: "primary.main",
                color: "white",
                fontSize: "0.65rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                mb: 1.5,
              }}
            >
              Directory
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Premium Kitchens
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                fontSize: "0.85rem",
                opacity: 0.6,
              }}
            >
              {filteredRestaurants.length} AVAILABLE
            </Typography>
            <Button
              variant="text"
              sx={{
                color: "primary.main",
                fontWeight: 800,
                fontSize: "0.75rem",
                transition: "all 0.3s ease",
                "&:hover": { letterSpacing: "0.1em", bgcolor: "transparent" },
              }}
              endIcon={<ChevronRight sx={{ fontSize: 16 }} />}
              onClick={() => navigate("/explore")}
            >
              VIEW ALL
            </Button>
          </Box>
        </Box>

        {filteredRestaurants.length === 0 ? (
          <Box
            sx={{
              py: 10,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: "32px",
              border: "1px dashed rgba(0,0,0,0.1)",
            }}
          >
            <Typography color="text.secondary" fontWeight={700}>
              No kitchens found for "{activeCategory}"
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: { xs: 2, md: 4 },
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(5, 1fr)",
              },
            }}
          >
            {filteredRestaurants.slice(0, 8).map((restaurant) => (
              <SwiggyFoodCard key={restaurant.id} {...restaurant} />
            ))}
          </Box>
        )}
      </Container>

      <Container
        maxWidth="xxl"
        sx={{ py: 8, px: { xs: 2, md: 8 }, bgcolor: "background.default" }}
      >
        <Box
          sx={{
            mb: 5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
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
                bgcolor: "secondary.main",
                color: "white",
                fontSize: "0.65rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                mb: 1.5,
              }}
            >
              Directory
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Summer Specialties
            </Typography>
          </Box>
          <Button
            variant="text"
            sx={{
              color: "text.secondary",
              fontWeight: 800,
              fontSize: "0.75rem",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "primary.main",
                letterSpacing: "0.1em",
                bgcolor: "transparent",
              },
            }}
            endIcon={<ChevronRight sx={{ fontSize: 16 }} />}
            onClick={() => navigate("/ExploreFood")}
          >
            VIEW ARCHIVES
          </Button>
        </Box>

        {filteredDishes.length === 0 ? (
          <Box
            sx={{
              py: 10,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: "32px",
              border: "1px dashed rgba(0,0,0,0.1)",
            }}
          >
            <Typography color="text.secondary" fontWeight={700}>
              No specialties found for "{activeCategory}"
            </Typography>
          </Box>
        ) : (
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
            {filteredDishes.slice(0, 8).map((dish) => (
              <DishCard key={dish.id} {...dish} />
            ))}
          </Box>
        )}
      </Container>
      <MealsSection />
    </Box>
  );
};

export default Browse;
