import { Box, Typography, IconButton, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../utils/api";
import StarIcon from "@mui/icons-material/Star";
import TimerIcon from "@mui/icons-material/Timer";

import { useNavigate } from "react-router-dom";

const DishCard = ({
  id,
  name,
  restaurant,
  restaurantId,
  price,
  image,
  tag,
  category,
  rating,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClick = () => {
    if (restaurantId) {
      navigate(`/menu/${restaurantId}`);
    } else if (id) {
       navigate(`/food/${id}/restaurants`);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      if (!id || !restaurantId) {
        console.error("Missing productId or restaurantId in DishCard");
        return;
      }
      await api.post("/api/cart/add", {
        productId: id,
        restaurantId,
        quantity: 1,
      });
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };
  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        "&:hover .dish-image": {
          transform: "scale(1.08)",
        },
        "&:hover .add-btn": {
          opacity: 1,
        },
      }}
    >
      {/* ---------- IMAGE ---------- */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 3,
          overflow: "hidden",
          mb: 1,
        }}
      >
        <Box
          component="img"
          className="dish-image"
          src={image ? `${image}${image.includes('?') ? '&' : '?'}auto=format&fit=crop&w=400&q=60` : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=60"}
          alt={name}
          loading="lazy"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s ease",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            bgcolor: theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(4px)",
            px: 1.5,
            py: 0.5,
            borderRadius: "100px",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: theme.palette.mode === "dark" ? "white" : "inherit",
          }}
        >
          <StarIcon sx={{ color: "#FFB800", fontSize: 16 }} />
          <Typography sx={{ fontWeight: 800, fontSize: "0.75rem" }}>{rating || "4.5"}</Typography>
        </Box>
        <IconButton
          className="add-btn"
          onClick={handleAddToCart}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "secondary.main",
            color: "white",
            opacity: 0,
            transition: "all 0.3s ease",
            "&:hover": { bgcolor: "secondary.dark", transform: "scale(1.1)" },
            boxShadow: "0 8px 20px rgba(249, 115, 22, 0.4)",
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.65rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            mb: 1,
          }}
        >
          {category || "Signature Dish"}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 1,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.6em",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {name}
        </Typography>
        <Box sx={{ mt: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 900,
              color: "primary.main",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            ₹{Number(price).toFixed(2)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
            }}
          >
            <TimerIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>25-30 min</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DishCard;
