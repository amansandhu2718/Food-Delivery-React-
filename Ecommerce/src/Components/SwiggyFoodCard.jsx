import React from "react";
import {
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { useNavigate } from "react-router-dom";

const SwiggyFoodCard = ({
  id,
  name,
  cuisine,
  rating,
  deliveryTime,
  deliveryFee,
  image,
  featured,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => id && navigate(`/menu/${id}`)}
      sx={{
        borderRadius: "32px",
        overflow: "hidden",
        bgcolor: "background.paper",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.palette.mode === "dark" ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.08)",
          "& .restaurant-image": { transform: "scale(1.1)" },
        },
      }}
    >
      {/* Image Container */}
      <Box sx={{ position: "relative", pt: "60%", overflow: "hidden" }}>
        <Box
          component="img"
          className="restaurant-image"
          src={image ? `${image}${image.includes('?') ? '&' : '?'}auto=format&fit=crop&w=500&q=60` : "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=60"}
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
        
        {/* Featured Badge */}
        {featured && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              bgcolor: "primary.main",
              color: "white",
              fontSize: "0.65rem",
              fontWeight: 800,
              px: 1.5,
              py: 0.5,
              borderRadius: "100px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              boxShadow: "0 4px 12px rgba(1, 128, 41, 0.3)",
            }}
          >
            Featured
          </Box>
        )}

        {/* Rating Badge */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            right: 12,
            bgcolor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            px: 1.2,
            py: 0.4,
            borderRadius: "100px",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <StarIcon sx={{ color: "#FFB800", fontSize: 14 }} />
          <Typography sx={{ fontWeight: 800, fontSize: "0.7rem", color: "white" }}>{rating || "4.0"}</Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: "1.05rem",
            mb: 0.5,
            lineHeight: 1.2,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: "text.primary",
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.75rem",
            fontWeight: 600,
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {cuisine}
        </Typography>
        
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            alignItems: "center",
            gap: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
            <AccessTimeIcon sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700 }}>
              {deliveryTime}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
            <TwoWheelerIcon sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700 }}>
              {deliveryFee === "Free" ? "FREE" : (deliveryFee || "").toUpperCase()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SwiggyFoodCard;