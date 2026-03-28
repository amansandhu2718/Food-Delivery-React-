import { useState, useMemo, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Chip,
  useTheme,
  Divider,
  Stack,
  InputBase,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router-dom";

import SwiggyFoodCard from "../../Components/SwiggyFoodCard";

function RestaurantsPage() {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  /* ---- filter state ---- */
  const [rating4Plus, setRating4Plus] = useState(false);
  const [pureVeg, setPureVeg] = useState(false);
  const [offers, setOffers] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [restaurantsData, setRestaurantsData] = useState([]);
  const [location, setLocation] = useState(null);

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
  }, []);

  const fetchRestaurants = async (lat = null, long = null) => {
    try {
      const api = (await import("../../utils/api")).default;
      let url = "/api/restaurants";
      if (lat && long) {
        url += `?lat=${lat}&long=${long}`;
      }
      const res = await api.get(url);
      console.log("fetchDishes" + JSON.stringify(res.data));

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

      if (selectedCategory) {
        const hasCuisine = r.cuisine?.some(
          (c) => c.toLowerCase() === selectedCategory.toLowerCase(),
        );
        if (!hasCuisine) return false;
      }

      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesName = r.name?.toLowerCase().includes(lowerSearch);
        const matchesCuisine = r.cuisine?.some((c) =>
          c.toLowerCase().includes(lowerSearch),
        );
        if (!matchesName && !matchesCuisine) return false;
      }

      return true;
    });
  }, [
    restaurantsData,
    rating4Plus,
    pureVeg,
    offers,
    fastDelivery,
    openNow,
    selectedCategory,
    searchTerm,
  ]);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* HERO */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #064e3b 0%, #171717 100%)"
              : "linear-gradient(135deg, #059669 0%, #064e3b 100%)",
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
            Premium Kitchens
          </Typography>
          <Typography
            sx={{
              opacity: 0.8,
              fontWeight: 700,
              letterSpacing: "0.2em",
              fontSize: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            CURATED GASTRONOMY NEAR YOU
          </Typography>
        </Container>
        {/* Subtle texture overlay */}
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

      {/* FILTERS */}
      <Container
        maxWidth="xxl"
        sx={{
          mt: -4,
          mb: 6,
          px: { xs: 2, md: 8 },
          position: "relative",
          zIndex: 10,
        }}
      >
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
                placeholder="Search for your favorite kitchens or cuisines..."
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

          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
            sx={{ gap: 2 }}
          >
            <Chip
              label="Rating 4+"
              clickable
              onClick={() => setRating4Plus((v) => !v)}
              sx={chipStyle(rating4Plus, theme)}
            />
            <Chip
              label="Pure Veg"
              clickable
              onClick={() => setPureVeg((v) => !v)}
              sx={chipStyle(pureVeg, theme)}
            />
            <Chip
              label="Offers"
              clickable
              onClick={() => setOffers((v) => !v)}
              sx={chipStyle(offers, theme)}
            />
            <Chip
              label="Fast Delivery"
              clickable
              onClick={() => setFastDelivery((v) => !v)}
              sx={chipStyle(fastDelivery, theme)}
            />
            <Chip
              label="Open Now"
              clickable
              onClick={() => setOpenNow((v) => !v)}
              sx={chipStyle(openNow, theme)}
            />
          </Stack>

          {(rating4Plus ||
            pureVeg ||
            offers ||
            fastDelivery ||
            openNow ||
            selectedCategory) && (
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid " + theme.palette.divider,
              }}
            >
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {selectedCategory && (
                  <AppliedChip
                    label={`CUISINE: ${selectedCategory.toUpperCase()}`}
                    onDelete={() => {
                      setSelectedCategory(null);
                      setSearchParams({});
                    }}
                  />
                )}
                {rating4Plus && (
                  <AppliedChip
                    label="RATING 4+"
                    onDelete={() => setRating4Plus(false)}
                  />
                )}
                {pureVeg && (
                  <AppliedChip
                    label="PURE VEG"
                    onDelete={() => setPureVeg(false)}
                  />
                )}
                {offers && (
                  <AppliedChip
                    label="OFFERS"
                    onDelete={() => setOffers(false)}
                  />
                )}
                {fastDelivery && (
                  <AppliedChip
                    label="FAST DELIVERY"
                    onDelete={() => setFastDelivery(false)}
                  />
                )}
                {openNow && (
                  <AppliedChip
                    label="OPEN NOW"
                    onDelete={() => setOpenNow(false)}
                  />
                )}
              </Stack>
            </Box>
          )}
        </Box>
      </Container>

      {/* RESTAURANT GRID */}
      <Container maxWidth="xxl" sx={{ pb: 12, px: { xs: 2, md: 8 } }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Explore All Kitchens
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontWeight: 700,
              fontSize: "0.85rem",
              opacity: 0.6,
            }}
          >
            {filteredRestaurants.length} RESULTS FOUND
          </Typography>
        </Box>

        {filteredRestaurants.length === 0 ? (
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
              No kitchens match your journal filters.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(6, 1fr)",
              },
              gap: 4,
            }}
          >
            {filteredRestaurants.map((restaurant) => (
              <SwiggyFoodCard key={restaurant.id} {...restaurant} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

const chipStyle = (active, theme) => ({
  bgcolor: active ? "primary.main" : "background.default",
  color: active ? "white" : "text.secondary",
  fontWeight: 800,
  fontSize: "0.65rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  px: 1,
  height: "36px",
  border: "1px solid " + (active ? "transparent" : theme.palette.divider),
  transition: "all 0.3s ease",
  "&:hover": {
    bgcolor: active ? "primary.dark" : "rgba(5, 150, 105, 0.05)",
    borderColor: "primary.main",
  },
});

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
      "& .MuiChip-deleteIcon": {
        color: "white !important",
        "&:hover": { opacity: 0.8 },
      },
    }}
  />
);

export default RestaurantsPage;
