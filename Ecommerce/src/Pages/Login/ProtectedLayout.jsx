import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLoginInfo } from "../../utils/CustomHooks";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import HistoryIcon from "@mui/icons-material/History";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import RestaurantCard from "../../Components/RestaurantCard";
import LocationSelector from "../../Components/LocationSelector";
import { GetColors } from "../../utils/Theme";
import {
  Typography,
  Box,
  Button,
  Container,
  Grid,
  Chip,
  useTheme,
} from "@mui/material";
import AppSidebar from "../Global/Sidebar";
import Topbar from "../Global/Topbar";

const mainMenuItems = [
  { label: "Main", isHeading: true },
  { label: "Home", path: "/", icon: <HomeIcon /> },

  { label: "Discover", isHeading: true },
  {
    label: "Explore Restaurants",
    path: "/explore",
    icon: <FoodBankIcon />,
  },
  { label: "Search Food", path: "/ExploreFood", icon: <FastfoodIcon /> },
  { label: "Offers", path: "/offers", icon: <LocalOfferIcon /> },

  { label: "Orders & Cart", isHeading: true },
  { label: "My Orders", path: "/orders", icon: <HistoryIcon /> },
  { label: "Cart", path: "/cart", icon: <ShoppingCartIcon /> },
  { label: "Favorites", path: "/favorites", icon: <FavoriteIcon /> },

  { label: "Profile & Help", isHeading: true },
  { label: "Profile", path: "/profile", icon: <AccountCircleIcon /> },
  { label: "Help & Support", path: "/support", icon: <ContactSupportIcon /> },
];

const ProtectedLayout = () => {
  const [loginInfo] = useLoginInfo();
  const [open, SetOpen] = useState(false);

  // Consider user authenticated if we have loginInfo stored
  if (!loginInfo) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app">
      <AppSidebar open={open} SetOpen={SetOpen} data={mainMenuItems} />
      <main className="content">
        <Topbar open={open} SetOpen={SetOpen} />
        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </main>
    </div>
  );
};

export default ProtectedLayout;
