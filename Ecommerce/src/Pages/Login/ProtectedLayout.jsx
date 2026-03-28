import { Navigate, Outlet } from "react-router-dom";

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
import { Typography, Box, Button, Container, Grid, Chip } from "@mui/material";
import AppSidebar from "../Global/Sidebar";
import Topbar from "../Global/Topbar";
import { useSelector } from "react-redux";
import RestaurantAppBar from "../../Components/RestaurantAppBar";
import ScrollToTop from "../../Components/ScrollToTop";

import LocationGuard from "../../Components/LocationGuard";

const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app">
      <ScrollToTop />
      <main className="content">
        <RestaurantAppBar />
        <Box sx={{ p: 0, minHeight: 'calc(100vh - 80px)' }}>
          <LocationGuard>
            <Outlet />
          </LocationGuard>
        </Box>
      </main>
    </div>
  );
};

export default ProtectedLayout;
