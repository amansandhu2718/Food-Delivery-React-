import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const MealCard = ({
  id,
  name,
  restaurant,
  restaurantId,
  rating,
  price,
  image,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = () => {
    if (restaurantId) {
       navigate(`/menu/${restaurantId}`);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (!id || !restaurantId) {
        console.error("Missing productId or restaurantId in MealCard");
        return;
      }
      await api.post("/api/cart/add", {
        productId: id,
        restaurantId,
        quantity: 1,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: "relative",
        borderRadius: "32px",
        overflow: "hidden",
        width: "100%",
        pt: "125%", // 4:5 Aspect Ratio
        bgcolor: "background.paper",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.02)",
          "& .meal-image": { transform: "scale(1.1)" },
          "& .content-overlay": { transform: "translateY(-10px)" },
        },
      }}
    >
      <Box
        component="img"
        className="meal-image"
        src={image ? `${image}${image.includes('?') ? '&' : '?'}auto=format&fit=crop&w=500&q=60` : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60"}
        alt={name}
        loading="lazy"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.8s ease",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 60%)",
        }}
      />

      {/* Action Buttons */}
      <Box sx={{ position: "absolute", top: 20, right: 20, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <IconButton
          onClick={toggleFavorite}
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            color: isFavorite ? "#ff4d4d" : "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
          }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton
          onClick={handleAddToCart}
          disabled={loading}
          sx={{
            bgcolor: "secondary.main",
            color: "white",
            boxShadow: `0 8px 20px ${theme.palette.mode === "dark" ? "rgba(0,0,0,0.4)" : "rgba(249, 115, 22, 0.3)"}`,
            "&:hover": { bgcolor: "secondary.dark" },
            transition: "all 0.3s ease",
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
        </IconButton>
      </Box>

      {/* Content Overlay */}
      <Box
        className="content-overlay"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          transition: "transform 0.4s ease",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <StarIcon sx={{ color: "#FFB800", fontSize: 16 }} />
          <Typography sx={{ color: "white", fontWeight: 700, fontSize: "0.85rem" }}>
            {rating || "4.5"}
          </Typography>
        </Box>
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: 800,
            mb: 0.5,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            lineHeight: 1.2,
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.75rem",
            mb: 1,
            fontWeight: 600,
          }}
        >
          {restaurant}
        </Typography>
        <Typography
          sx={{
            color: "secondary.main",
            fontSize: "1.25rem",
            fontWeight: 900,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          ₹{price}
        </Typography>
      </Box>
    </Box>
  );
};

export default MealCard;
