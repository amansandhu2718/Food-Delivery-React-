// import {
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Box,
//   Chip,
//   Rating,
//   Button,
// } from "@mui/material";
// import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
// import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

// const RestaurantCard = ({ restaurant }) => {
//   const {
//     name,
//     image,
//     rating,
//     cuisine,
//     location,
//     deliveryTime,
//     priceForTwo,
//     isOpen,
//   } = restaurant;

//   return (
//     <Card
//       sx={{
//         maxWidth: 345,
//         borderRadius: 3,
//         boxShadow: 3,
//         transition: "0.3s",
//         "&:hover": {
//           transform: "scale(1.01)",
//           boxShadow: 6,
//         },
//       }}
//     >
//       <CardMedia component="img" height="180" image={image} alt={name} />

//       <CardContent>
//         {/* Restaurant Name + Rating */}
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="h6" fontWeight={600}>
//             {name}
//           </Typography>
//           <Rating value={rating} precision={0.1} readOnly size="small" />
//         </Box>

//         {/* Cuisine */}
//         <Typography variant="body2" color="text.secondary" mt={0.5}>
//           {cuisine.join(", ")}
//         </Typography>

//         {/* Location */}
//         <Box display="flex" alignItems="center" gap={0.5} mt={1}>
//           <LocationOnOutlinedIcon fontSize="small" color="action" />
//           <Typography variant="body2" color="text.secondary">
//             {location}
//           </Typography>
//         </Box>

//         {/* Delivery Time & Price */}
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           mt={1.5}
//         >
//           <Box display="flex" alignItems="center" gap={0.5}>
//             <AccessTimeOutlinedIcon fontSize="small" color="action" />
//             <Typography variant="body2">{deliveryTime} mins</Typography>
//           </Box>

//           <Typography variant="body2" fontWeight={500}>
//             ₹{priceForTwo} for two
//           </Typography>
//         </Box>

//         {/* Status */}
//         <Box mt={2} display="flex" justifyContent="space-between">
//           <Chip
//             label={isOpen ? "Open Now" : "Closed"}
//             color={isOpen ? "success" : "default"}
//             size="small"
//           />
//           <Button size="small" variant="contained">
//             View Menu
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default RestaurantCard;

import { memo } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { GetColors } from "../utils/Theme";

const getOptimizedImageUrl = (url) => {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80";
  }
  // If it's an Unsplash URL, append optimization params
  if (url.includes("images.unsplash.com")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}w=500&q=80`;
  }
  return url;
};

const RestaurantCard = memo(({ restaurant }) => {
  const chipStyle = (active, theme) => ({
  bgcolor: active ? theme.palette.primary.main : "background.paper",
  color: active ? "white" : "text.secondary",
  });
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    id,
    name,
    image,
    rating,
    cuisine,
    location,
    deliveryTime,
    priceForTwo,
    isOpen,
  } = restaurant;

  const handleViewMenu = () => {
    navigate(`/menu/${id}`);
  };

  const optimizedImage = getOptimizedImageUrl(image);

  return (
    <Card
      onClick={handleViewMenu}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition:
          "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
        bgcolor: "background.paper",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.palette.mode === "dark" ? "0 12px 30px rgba(0,0,0,0.4)" : "0 12px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1/1",
          // pt: "56.25%" /* 16:9 Aspect Ratio */,
        }}
      >
        <CardMedia
          component="img"
          image={optimizedImage}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80";
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {!isOpen && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <Typography variant="h6" color="white" fontWeight="bold">
              CLOSED
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 1 }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              lineHeight: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              flex: 1,
              mr: 1,
            }}
          >
            {name}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            bgcolor="primary.main"
            px={0.8}
            py={0.2}
            borderRadius="4px"
          >
            <Typography
              variant="caption"
              fontWeight="bold"
              color="white"
              sx={{ mr: 0.2 }}
            >
              {rating}
            </Typography>
            <Rating
              value={1}
              max={1}
              readOnly
              size="small"
              sx={{ color: "white" }}
            />
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            mb: 1,
          }}
        >
          {cuisine?.join(", ") || "Global Cuisine"}
        </Typography>

        <Box display="flex" alignItems="center" gap={0.5} mb={1.5}>
          <LocationOnOutlinedIcon
            sx={{ fontSize: 16, color: "text.secondary" }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ flex: 1 }}
          >
            {location}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt="auto"
          pt={1.5}
          borderTop={`1px dashed ${theme.palette.divider}`}
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTimeOutlinedIcon
              sx={{ fontSize: 18, color: "secondary.main" }}
            />
            <Typography variant="caption" fontWeight="600">
              {deliveryTime} mins
            </Typography>
          </Box>

          <Typography
            variant="caption"
            fontWeight="700"
            color="text.secondary"
          >
            ₹{priceForTwo} FOR TWO
          </Typography>
        </Box>
      </CardContent>

      {/* Bottom Action Bar */}
      <Box
        sx={{
          p: 2,
          pt: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Chip
          label={isOpen ? "Open Now" : "Closed"}
          color={isOpen ? "success" : "default"}
          size="small"
        />
        <Button variant="contained" size="small" onClick={handleViewMenu}>
          View Menu
        </Button>
      </Box>
    </Card>
  );
});

export default RestaurantCard;
