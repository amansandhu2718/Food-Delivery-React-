import { useState, useMemo } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Chip,
  useTheme,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchParams } from "react-router-dom";

import RestaurantCard from "../../Components/RestaurantCard";
import LocationSelector from "../../Components/LocationSelector";
import { GetColors } from "../../utils/Theme";
import { useEffect } from "react";

/* =======================
   DATA
======================= */

// const restaurantsData = [
//   {
//     id: 1,
//     name: "Spice Garden",
//     image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
//     rating: 4.4,
//     cuisine: ["North Indian", "Chinese"],
//     location: "Indiranagar, Bangalore",
//     deliveryTime: 30,
//     priceForTwo: 600,
//     isOpen: true,
//     isVeg: true,
//     hasOffer: true,
//   },
//   {
//     id: 2,
//     name: "Burger Hub",
//     image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
//     rating: 4.2,
//     cuisine: ["Burgers", "Fast Food"],
//     location: "Koramangala, Bangalore",
//     deliveryTime: 25,
//     priceForTwo: 500,
//     isOpen: false,
//     isVeg: false,
//     hasOffer: false,
//   },
//   {
//     id: 3,
//     name: "Italiano",
//     image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
//     rating: 4.6,
//     cuisine: ["Italian", "Pizza"],
//     location: "Whitefield, Bangalore",
//     deliveryTime: 35,
//     priceForTwo: 800,
//     isOpen: true,
//     isVeg: false,
//     hasOffer: true,
//   },
//   {
//     id: 4,
//     name: "Spice Garden",
//     image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
//     rating: 4.4,
//     cuisine: ["North Indian", "Chinese"],
//     location: "Indiranagar, Bangalore",
//     deliveryTime: 30,
//     priceForTwo: 600,
//     isOpen: true,
//     isVeg: true,
//     hasOffer: true,
//   },
//   {
//     id: 5,
//     name: "Burger Hub",
//     image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
//     rating: 4.2,
//     cuisine: ["Burgers", "Fast Food"],
//     location: "Koramangala, Bangalore",
//     deliveryTime: 25,
//     priceForTwo: 500,
//     isOpen: false,
//     isVeg: false,
//     hasOffer: false,
//   },
//   {
//     id: 6,
//     name: "Italiano",
//     image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
//     rating: 4.6,
//     cuisine: ["Italian", "Pizza"],
//     location: "Whitefield, Bangalore",
//     deliveryTime: 35,
//     priceForTwo: 800,
//     isOpen: true,
//     isVeg: false,
//     hasOffer: true,
//   },
//   {
//     id: 7,
//     name: "Spice Garden",
//     image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
//     rating: 4.4,
//     cuisine: ["North Indian", "Chinese"],
//     location: "Indiranagar, Bangalore",
//     deliveryTime: 30,
//     priceForTwo: 600,
//     isOpen: true,
//     isVeg: true,
//     hasOffer: true,
//   },
//   {
//     id: 8,
//     name: "Burger Hub",
//     image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
//     rating: 4.2,
//     cuisine: ["Burgers", "Fast Food"],
//     location: "Koramangala, Bangalore",
//     deliveryTime: 25,
//     priceForTwo: 500,
//     isOpen: false,
//     isVeg: false,
//     hasOffer: false,
//   },
//   {
//     id: 9,
//     name: "Italiano",
//     image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
//     rating: 4.6,
//     cuisine: ["Italian", "Pizza"],
//     location: "Whitefield, Bangalore",
//     deliveryTime: 35,
//     priceForTwo: 800,
//     isOpen: true,
//     isVeg: false,
//     hasOffer: true,
//   },
//   {
//     id: 10,
//     name: "Spice Garden",
//     image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
//     rating: 4.4,
//     cuisine: ["North Indian", "Chinese"],
//     location: "Indiranagar, Bangalore",
//     deliveryTime: 30,
//     priceForTwo: 600,
//     isOpen: true,
//     isVeg: true,
//     hasOffer: true,
//   },
//   {
//     id: 11,
//     name: "Burger Hub",
//     image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
//     rating: 4.2,
//     cuisine: ["Burgers", "Fast Food"],
//     location: "Koramangala, Bangalore",
//     deliveryTime: 25,
//     priceForTwo: 500,
//     isOpen: false,
//     isVeg: false,
//     hasOffer: false,
//   },
//   {
//     id: 12,
//     name: "Italiano",
//     image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
//     rating: 4.6,
//     cuisine: ["Italian", "Pizza"],
//     location: "Whitefield, Bangalore",
//     deliveryTime: 35,
//     priceForTwo: 800,
//     isOpen: true,
//     isVeg: false,
//     hasOffer: true,
//   },
//   {
//     id: 13,
//     name: "Spice Garden",
//     image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
//     rating: 4.4,
//     cuisine: ["North Indian", "Chinese"],
//     location: "Indiranagar, Bangalore",
//     deliveryTime: 30,
//     priceForTwo: 600,
//     isOpen: true,
//     isVeg: true,
//     hasOffer: true,
//   },
//   {
//     id: 14,
//     name: "Burger Hub",
//     image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
//     rating: 4.2,
//     cuisine: ["Burgers", "Fast Food"],
//     location: "Koramangala, Bangalore",
//     deliveryTime: 25,
//     priceForTwo: 500,
//     isOpen: false,
//     isVeg: false,
//     hasOffer: false,
//   },
//   {
//     id: 15,
//     name: "Italiano",
//     image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
//     rating: 4.6,
//     cuisine: ["Italian", "Pizza"],
//     location: "Whitefield, Bangalore",
//     deliveryTime: 35,
//     priceForTwo: 800,
//     isOpen: true,
//     isVeg: false,
//     hasOffer: true,
//   },
// ];

/* =======================
   COMPONENT
======================= */

function RestaurantsPage() {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const [searchParams, setSearchParams] = useSearchParams(); // NEW

  /* ---- filter state ---- */
  const [rating4Plus, setRating4Plus] = useState(false);
  const [pureVeg, setPureVeg] = useState(false);
  const [offers, setOffers] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // NEW

  const [restaurantsData, setRestaurantsData] = useState([]);
  const [location, setLocation] = useState(null);

  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const isOpenParam = searchParams.get("isOpen");

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (isOpenParam === "true") {
      setOpenNow(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchRestaurants();

    // Listen for location changes
    const handleLocationChange = (event) => {
      setLocation(event.detail);
      fetchRestaurants(event.detail.lat, event.detail.long);
    };

    window.addEventListener("locationChanged", handleLocationChange);

    // Try to get current location from API
    const getCurrentLocation = async () => {
      try {
        const api = (await import("../../utils/api")).default;
        const res = await api.get("/api/addresses/current");
        if (res.data?.lat && res.data?.long) {
          setLocation({ lat: res.data.lat, long: res.data.long });
          fetchRestaurants(res.data.lat, res.data.long);
        } else {
          fetchRestaurants();
        }
      } catch (err) {
        fetchRestaurants();
      }
    };

    getCurrentLocation();

    return () => {
      window.removeEventListener("locationChanged", handleLocationChange);
    };
  }, []);

  const fetchRestaurants = async (lat = null, long = null) => {
    try {
      const api = (await import("../../utils/api")).default;
      let url = "/api/restaurants";
      if (lat && long) {
        url += `?lat=${lat}&long=${long}`;
      }
      const res = await api.get(url);
      setRestaurantsData(res.data || []);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      setRestaurantsData([]);
    }
  };

  const filteredRestaurants = useMemo(() => {
    return restaurantsData.filter((r) => {
      if (rating4Plus && r.rating < 4) return false;
      if (pureVeg && !r.isVeg) return false;
      if (offers && !r.hasOffer) return false;
      if (fastDelivery && r.deliveryTime > 30) return false;
      if (openNow && !r.isOpen) return false;

      // Filter by Category/Cuisine
      if (selectedCategory) {
        // Check if cuisine array contains the category (case-insensitive)
        const hasCuisine = r.cuisine?.some(c => c.toLowerCase() === selectedCategory.toLowerCase());
        if (!hasCuisine) return false;
      }

      return true;
    });
  }, [restaurantsData, rating4Plus, pureVeg, offers, fastDelivery, openNow, selectedCategory]);

  /* =======================
     UI
  ======================= */

  return (
    <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
      {/* HERO */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          textAlign: "center",
          background: "linear-gradient(135deg, #3f2aa0 0%, #ff8a65 100%)",
          color: "#000000ff",
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Discover Restaurants Near You
        </Typography>
        <Typography sx={{ mt: 1, opacity: 0.9 }}>
          Browse top-rated restaurants and exclusive offers
        </Typography>
      </Box>

      {/* SEARCH + FILTERS */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 3 }}>
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            p: 2,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}></Grid>

            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label="Rating 4+"
                  clickable
                  onClick={() => setRating4Plus((v) => !v)}
                  sx={chipStyle(rating4Plus, colors)}
                />
                <Chip
                  label="Pure Veg"
                  clickable
                  onClick={() => setPureVeg((v) => !v)}
                  sx={chipStyle(pureVeg, colors)}
                />
                <Chip
                  label="Offers"
                  clickable
                  onClick={() => setOffers((v) => !v)}
                  sx={chipStyle(offers, colors)}
                />
                <Chip
                  label="Fast Delivery"
                  clickable
                  onClick={() => setFastDelivery((v) => !v)}
                  sx={chipStyle(fastDelivery, colors)}
                />
                <Chip
                  label="Open Now"
                  clickable
                  onClick={() => setOpenNow((v) => !v)}
                  sx={chipStyle(openNow, colors)}
                />
              </Stack>
            </Grid>
          </Grid>

          {/* APPLIED FILTERS */}
          {(rating4Plus || pureVeg || offers || fastDelivery || openNow || selectedCategory) && (
            <>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {selectedCategory && (
                  <AppliedChip
                    label={`Cuisine: ${selectedCategory}`}
                    onDelete={() => {
                      setSelectedCategory(null);
                      setSearchParams({}); // Clean URL
                    }}
                  />
                )}
                {rating4Plus && (
                  <AppliedChip
                    label="Rating 4+"
                    onDelete={() => setRating4Plus(false)}
                  />
                )}
                {pureVeg && (
                  <AppliedChip
                    label="Pure Veg"
                    onDelete={() => setPureVeg(false)}
                  />
                )}
                {offers && (
                  <AppliedChip
                    label="Offers"
                    onDelete={() => setOffers(false)}
                  />
                )}
                {fastDelivery && (
                  <AppliedChip
                    label="Fast Delivery"
                    onDelete={() => setFastDelivery(false)}
                  />
                )}
                {openNow && (
                  <AppliedChip
                    label="Open Now"
                    onDelete={() => setOpenNow(false)}
                  />
                )}
              </Stack>
            </>
          )}
        </Box>
      </Container>

      {/* RESTAURANT GRID */}
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {filteredRestaurants.map((restaurant) => (
          <Box
            key={restaurant.id}
            sx={{
              minWidth: 260,
              width: {
                xs: "100%",
                sm: "45%",
                md: "30%",
                lg: "22%",
              },
            }}
          >
            <RestaurantCard restaurant={restaurant} />
          </Box>
        ))}

        {filteredRestaurants.length === 0 && (
          <Typography color="text.secondary">
            No restaurants match your filters.
          </Typography>
        )}
      </Container>
    </Box>
  );
}

/* =======================
   HELPERS
======================= */

const chipStyle = (active, colors) => ({
  bgcolor: active ? colors.greenAccent[500] : "transparent",
  color: active ? colors.Font[100] : "inherit",
  fontWeight: 600,
  fontSize: "0.75rem",
  "&:hover": {
    bgcolor: active ? colors.greenAccent[600] : "action.hover",
  },
});

const AppliedChip = ({ label, onDelete }) => (
  <Chip
    label={label}
    onDelete={onDelete}
    deleteIcon={<CloseIcon />}
    color="primary"
    size="small"
  />
);

export default RestaurantsPage;
