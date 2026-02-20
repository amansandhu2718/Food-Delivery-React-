import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { GetColors } from "../utils/Theme";
import { useNavigate } from "react-router-dom";
import { memo, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import api from "../utils/api";

const DEFAULT_FOOD_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";

const getOptimizedImageUrl = (url) => {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return DEFAULT_FOOD_IMAGE;
  }
  if (url.startsWith("/uploads/")) {
    return `http://localhost:5001${url}`;
  }
  if (url.includes("images.unsplash.com")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}w=500&q=80`;
  }
  return url;
};

const FoodItem = memo(({ dish, onFavoriteToggle }) => {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(dish.isFavorite || false);

  const handleClick = () => {
    if (dish.restaurantId) {
      navigate(`/menu/${dish.restaurantId}`);
    } else {
      navigate(`/food/${dish.id}/restaurants`);
    }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      const res = await api.post("/api/favorites/toggle", {
        productId: dish.id,
        restaurantId: dish.restaurantId
      });
      setIsFavorite(res.data.isFavorite);
      if (onFavoriteToggle) onFavoriteToggle();
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const optimizedImage = getOptimizedImageUrl(dish.image);

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: "100%",
        height: "100%",
        aspectRatio: "1/1",
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        boxShadow: 3,
        cursor: "pointer",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
        },
      }}
    >
      {/* Favorite Button */}
      <IconButton
        onClick={handleFavoriteClick}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(4px)",
          color: isFavorite ? colors.redAccent[500] : "white",
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.4)",
          },
        }}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>

      {/* Image */}
      <Box
        component="img"
        src={optimizedImage}
        alt={dish.name}
        loading="lazy"
        onError={(e) => {
          e.target.src = DEFAULT_FOOD_IMAGE;
        }}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.08)",
          },
        }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))",
          pointerEvents: "none",
        }}
      />

      {/* Dish Name */}
      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          left: 8,
          right: 8,
          color: "#fff",
          pointerEvents: "none",
        }}
      >
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{
            fontSize: "0.8rem",
            lineHeight: 1.2,
            textShadow: "0 2px 6px rgba(0,0,0,0.6)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {dish.name}
        </Typography>
        {dish.restaurantName && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontSize: "0.65rem",
              opacity: 0.9,
              textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            }}
          >
            {dish.restaurantName}
          </Typography>
        )}
      </Box>
    </Box>
  );
});

export default FoodItem;
