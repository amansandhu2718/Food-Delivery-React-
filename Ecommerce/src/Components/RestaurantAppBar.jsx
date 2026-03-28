import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  InputBase,
  Switch,
  styled,
  useTheme,
  Stack,
  Button,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Logout,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Explore as ExploreIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { clearAccessToken } from "../utils/authService";
import { MdDashboard } from "react-icons/md";

import LocationSelector from "./LocationSelector";
import Hero from "./HeroSection";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/Slices/authSlice";
import { useState } from "react";
import axios from "axios";
/* ---------------- Veg Switch ---------------- */

const VegSwitch = styled(Switch)(({ theme }) => ({
  width: 48,
  height: 24,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(24px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 20,
    height: 20,
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
  },
  "& .MuiSwitch-track": {
    borderRadius: 12,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)",
    opacity: 1,
  },
}));

/* ---------------- Component ---------------- */

function RestaurantAppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, accessToken, user } = useSelector(
    (state) => state.auth,
  );
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleLogout = async () => {
    setLogoutLoading(true);
    setLogoutError("");

    try {
      // Call backend to invalidate session/token first
      await api.post("/api/auth/logout");
      navigate("/login", { replace: true });
    } catch (e) {
      setLogoutError("Logout failed. Please try again.");
    } finally {
      // Always clear tokens and state, even if backend fails
      clearAccessToken();
      localStorage.removeItem("accessToken");
      dispatch(logout());
      setLogoutLoading(false);
    }
  };
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: "none",
          background:
            theme.palette.mode === "dark"
              ? "rgba(10, 10, 10, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          height: 80,
          display: "flex",
          justifyContent: "center",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xxl" sx={{ p: 0 }}>
          {/* ---------------- TOP BAR ---------------- */}
          <Toolbar
            sx={{
              px: { xs: 2, md: 8 },
              height: 80,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Typography
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 900,
                  fontSize: "1.85rem",
                  color: "primary.main",
                  letterSpacing: "-0.07em",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "scale(1.02)", opacity: 0.9 },
                  display: "flex",
                  alignItems: "baseline",
                }}
                onClick={() => navigate("/")}
              >
                Cravvy
                <Box component="span" sx={{ color: "secondary.main" }}>
                  .
                </Box>
              </Typography>
              <Box sx={{ display: { xs: "none", lg: "flex" } }}>
                <LocationSelector headerMode />
              </Box>
            </Box>

            {/* Desktop Search */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                borderRadius: "100px",
                alignItems: "center",
                px: 2.5,
                width: "100%",
                maxWidth: 400,
                height: 48,
                transition: "0.3s",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                },
              }}
            >
              <SearchIcon
                sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
              />
              <InputBase
                placeholder="Search for dishes, kitchens..."
                sx={{
                  color: "text.primary",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  width: "100%",
                }}
              />
            </Box>
            {isAuthenticated && !loading && (
              <>
                {/* Desktop View */}
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: "primary.main",
                      mr: 2,
                      fontWeight: 900,
                      fontSize: "0.75rem",
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(1, 128, 41, 0.05)",
                      px: 2,
                      py: 0.6,
                      borderRadius: "100px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      border:
                        "1px solid " +
                        (theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(1, 128, 41, 0.1)"),
                    }}
                  >
                    {user?.name?.split(" ")[0]}
                  </Typography>
                  {[
                    ...(user?.role?.toUpperCase() === "ADMIN" ||
                    user?.role?.toUpperCase() === "SUPER_ADMIN"
                      ? [
                          {
                            icon: <MdDashboard />,
                            title: "Dashboard",
                            path: "/admin/dashboard",
                          },
                        ]
                      : []),
                    { icon: <HomeIcon />, title: "Home", path: "/browse" },
                    {
                      icon: <ExploreIcon />,
                      title: "Explore",
                      path: "/explore",
                    },
                    {
                      icon: <FavoriteIcon />,
                      title: "Favorites",
                      path: "/favorites",
                    },
                    { icon: <ReceiptIcon />, title: "Orders", path: "/orders" },
                    {
                      icon: <ShoppingCartIcon />,
                      title: "Cart",
                      path: "/cart",
                    },
                    {
                      icon: <PersonIcon />,
                      title: "Profile",
                      path: "/profile",
                    },
                  ].map((item) => (
                    <Tooltip key={item.title} title={item.title}>
                      <IconButton
                        sx={{
                          color: "text.secondary",
                          transition: "0.2s",
                          "&:hover": {
                            color: "primary.main",
                            bgcolor:
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(1, 128, 41, 0.05)",
                          },
                        }}
                        onClick={() => navigate(item.path)}
                      >
                        {item.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                  <Button
                    variant="contained"
                    disableElevation
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    sx={{
                      ml: 2,
                      textTransform: "none",
                      borderRadius: "100px",
                      px: 3,
                      fontWeight: 700,
                      bgcolor: "secondary.main",
                      "&:hover": { bgcolor: "secondary.dark" },
                    }}
                  >
                    {logoutLoading ? "Wait..." : "Logout"}
                  </Button>
                </Box>

                {/* Mobile View */}
                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    size="large"
                    onClick={handleOpenNavMenu}
                    sx={{ color: "primary.main" }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElNav}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        borderRadius: 3,
                        minWidth: 200,
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                        border: "1px solid rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    {[
                      { icon: <HomeIcon />, text: "Home", path: "/browse" },
                      {
                        icon: <ExploreIcon />,
                        text: "Explore",
                        path: "/explore",
                      },
                      {
                        icon: <FavoriteIcon />,
                        text: "Favorites",
                        path: "/favorites",
                      },
                      {
                        icon: <ReceiptIcon />,
                        text: "Orders",
                        path: "/orders",
                      },
                      {
                        icon: <ShoppingCartIcon />,
                        text: "Cart",
                        path: "/cart",
                      },
                      {
                        icon: <PersonIcon />,
                        text: "Profile",
                        path: "/profile",
                      },
                    ].map((item) => (
                      <MenuItem
                        key={item.text}
                        onClick={() => {
                          navigate(item.path);
                          handleCloseNavMenu();
                        }}
                        sx={{ py: 1.5, gap: 2 }}
                      >
                        {React.cloneElement(item.icon, {
                          fontSize: "small",
                          sx: { color: "text.secondary" },
                        })}
                        <Typography fontWeight={600}>{item.text}</Typography>
                      </MenuItem>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <MenuItem
                      onClick={() => {
                        handleLogout();
                        handleCloseNavMenu();
                      }}
                      sx={{ py: 1.5, gap: 2 }}
                    >
                      <Logout fontSize="small" sx={{ color: "error.main" }} />
                      <Typography color="error" fontWeight={600}>
                        Logout
                      </Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {/* Spacer to push content below fixed appbar */}
      <Box sx={{ height: 90 }} />
    </Box>
  );
}

export default RestaurantAppBar;
