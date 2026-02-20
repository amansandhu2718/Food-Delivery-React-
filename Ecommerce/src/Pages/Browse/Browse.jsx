import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  useTheme,
  Button,
  Stack,
  Avatar,
  IconButton,
  Paper,
  InputBase,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RestaurantCard from "../../Components/RestaurantCard";
import { GetColors } from "../../utils/Theme";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const mockCategories = [
  {
    id: 1,
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },
  {
    id: 2,
    name: "Burger",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
  },
  {
    id: 3,
    name: "Sushi",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
  },
  {
    id: 4,
    name: "Dessert",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b",
  },
  {
    id: 5,
    name: "Healthy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
  },
  {
    id: 6,
    name: "Asian",
    image: "https://images.unsplash.com/photo-1541544744-378caae9a3ad",
  },
];

const Browse = () => {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/restaurants");
        if (res.data) {
          setRestaurants(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch restaurants", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter for Popular (e.g. high rating)
  const popularRestaurants = restaurants
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  // Filter for Offers
  const offerRestaurants = restaurants.filter((r) => r.hasOffer);

  const handleCategoryClick = (categoryName) => {
    // User wants to see *open* restaurants serving that item
    // We navigate to /explore with query params to filter there
    navigate(`/explore?category=${categoryName}&isOpen=true`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.greenAccent[600]} 0%, ${colors.blueAccent[700]} 100%)`,
          py: 6,
          px: 2,
          borderRadius: "0 0 24px 24px",
          mb: 4,
          color: "#fff",
          textAlign: "center",
          boxShadow: 4,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{ mb: 2, textShadow: "0px 2px 4px rgba(0,0,0,0.3)" }}
          >
            Hungry? We've got you covered.
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Order from the best restaurants near you.
          </Typography>

          {/* Search Bar Visual */}
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: 600,
              mx: "auto",
              borderRadius: 3,
              bgcolor:
                theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
            }}
          >
            <IconButton sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search for food or restaurants..."
              inputProps={{ "aria-label": "search google maps" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  navigate("/ExploreFood");
                }
              }}
            />
            <Button
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 3,
                bgcolor: colors.greenAccent[500],
                "&:hover": { bgcolor: colors.greenAccent[600] },
              }}
              onClick={() => navigate("/ExploreFood")}
            >
              Search
            </Button>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* CATEGORIES SECTION */}
        <Box sx={{ mb: 6 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
              What's on your mind?
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              color="secondary"
              onClick={() => navigate("/ExploreFood")}
            >
              View All
            </Button>
          </Box>

          <Stack
            direction="row"
            spacing={4}
            sx={{
              overflowX: "auto",
              pb: 2,
              "::-webkit-scrollbar": { height: "8px" },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: colors.primary[300],
                borderRadius: "4px",
              },
            }}
          >
            {mockCategories.map((cat) => (
              <Box
                key={cat.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  minWidth: 100,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <Avatar
                  src={cat.image}
                  alt={cat.name}
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 1,
                    boxShadow: 3,
                    border: `2px solid ${colors.greenAccent[500]}`,
                  }}
                />
                <Typography variant="h6" fontWeight="500">
                  {cat.name}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* BEST OFFERS SECTION (NEW) */}
        {offerRestaurants.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                color={colors.grey[100]}
              >
                Best Offers for You
              </Typography>
              <Button
                endIcon={<ArrowForwardIcon />}
                color="secondary"
                onClick={() => navigate("/explore")}
              >
                See All
              </Button>
            </Box>
            <Grid container spacing={3} alignItems="stretch">
              {offerRestaurants.slice(0, 4).map((restaurant) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.id} sx={{ display: 'flex' }}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* POPULAR RESTAURANTS SECTION */}
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
              Popular Restaurants
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              color="secondary"
              onClick={() => navigate("/explore")}
            >
              See All
            </Button>
          </Box>

          <Grid container spacing={3} alignItems="stretch">
            {popularRestaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.id} sx={{ display: 'flex' }}>
                <RestaurantCard restaurant={restaurant} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Browse;
