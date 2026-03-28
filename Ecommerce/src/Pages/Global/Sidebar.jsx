import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { clearAccessToken } from "../../utils/authService";

import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/Slices/authSlice";
import api from "../../utils/api";
import { postSeedDemo, postResetSystem } from "../../utils/adminMaintenance";

const drawerWidth = 260;

const AppSidebar = ({ open, SetOpen, data }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [maintLoading, setMaintLoading] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role?.toUpperCase();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (e) {
      console.error(e);
    }
    dispatch(logout());
    clearAccessToken();
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
  };

  const goToFoodApp = () => {
    navigate("/browse");
    if (isMobile) SetOpen(false);
  };

  const handleSeedDemo = async () => {
    setMaintLoading("seed");
    try {
      const res = await postSeedDemo();
      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      alert("Seeding failed: " + (err.response?.data?.message || err.message));
    } finally {
      setMaintLoading(null);
    }
  };

  const handleResetSystem = async () => {
    if (
      !window.confirm(
        "CRITICAL WARNING: This will delete ALL data (users, restaurants, orders) except your account. This is irreversible. Are you absolutely sure?",
      )
    ) {
      return;
    }
    setMaintLoading("reset");
    try {
      const res = await postResetSystem();
      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      alert("Reset failed: " + (err.response?.data?.message || err.message));
    } finally {
      setMaintLoading(null);
    }
  };

  const closeSettings = () => {
    if (maintLoading) return;
    setSettingsOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        backgroundColor: theme.palette.background.paper,
        borderRight: "1px solid " + (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
        display: "flex",
        flexDirection: "column",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
        "&::-webkit-scrollbar": {
          display: "none", // Chrome/Safari
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 4, textAlign: "center" }}>
        <AccountCircleIcon sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>{user?.name || "Guest"}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
          {user?.email || "user@email.com"}
        </Typography>
      </Box>

      {/* Icons */}
      <Divider variant="middle" sx={{ opacity: 0.1 }} />

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, py: 2 }}>
        <Tooltip title="Open food app" arrow>
          <IconButton
            aria-label="Open food app"
            sx={{ color: "text.secondary" }}
            onClick={goToFoodApp}
          >
            <FlagCircleIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Settings" arrow>
          <IconButton
            aria-label="Settings"
            sx={{ color: "text.secondary" }}
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Log out" arrow>
          <IconButton
            aria-label="Log out"
            sx={{ color: "text.secondary" }}
            onClick={handleLogout}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider variant="middle" sx={{ opacity: 0.1 }} />
      {/* Menu */}
      <List>
        {data &&
          data.map((item, index) => {
            if (item.isHeading) {
              return (
                <Typography
                  key={`heading-${index}`}
                  variant="h6"
                  sx={{
                    m: "25px 0 10px 25px",
                    color: "primary.main",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    fontSize: "0.65rem",
                    fontWeight: 900,
                  }}
                >
                  {item.label}
                </Typography>
              );
            }

            let active = location.pathname === item.path;

            // Handle special cases for highlighting
            if (
              item.path === "/admin/dashboard" &&
              (location.pathname === "/admin/" ||
                location.pathname === "/admin/dashboard")
            ) {
              active = true;
            } else if (
              item.path === "/" &&
              (location.pathname === "/" || location.pathname === "/browse")
            ) {
              active = true;
            }

            // Highlight "Search Food" when on a food-related page
            if (
              item.path === "/ExploreFood" &&
              (location.pathname === "/ExploreFood" ||
                location.pathname.startsWith("/food/"))
            ) {
              active = true;
            }

            // Highlight "Explore Restaurants" when on a menu-related page
            if (
              (item.path === "/explore" || item.path === "/Explore") &&
              (location.pathname === "/explore" ||
                location.pathname === "/Explore" ||
                location.pathname.startsWith("/menu/"))
            ) {
              active = true;
            }
            return (
              <ListItemButton
                key={item.path}
                selected={active}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) SetOpen(false);
                }}
                sx={{
                  borderRadius: "100px",
                  margin: "8px 16px",
                  py: 1.5,
                  color: "text.secondary",
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "& .MuiListItemIcon-root": { color: "white" },
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: "0.9rem" }}
                />
              </ListItemButton>
            );
          })}
      </List>
    </Box>
  );

  return (
    <>
    <Box
      sx={{
        flexShrink: 0,
        alignSelf: "stretch",
        height: { xs: "auto", md: "100vh" },
      }}
    >
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={() => SetOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.paper,
            border: "none",
            position: isMobile ? "fixed" : "sticky",
            top: 0,
            height: { xs: "100%", md: "100vh" },
            maxHeight: "100vh",
            overflow: "hidden",
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>

    <Dialog
      open={settingsOpen}
      onClose={closeSettings}
      disableEscapeKeyDown={!!maintLoading}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Settings
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: "divider" }}>
        {userRole === "SUPER_ADMIN" ? (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Demo data and full system reset affect every user and restaurant. Use only on local or test environments.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                variant="contained"
                fullWidth
                disabled={!!maintLoading}
                loading={maintLoading === "seed"}
                startIcon={<AutoFixHighIcon />}
                onClick={handleSeedDemo}
                sx={{
                  py: 1.25,
                  borderRadius: "999px",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #1e88e5 0%, #00acc1 100%)",
                  boxShadow: "none",
                }}
              >
                Seed demo data
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                disabled={!!maintLoading}
                loading={maintLoading === "reset"}
                startIcon={<RestartAltIcon />}
                onClick={handleResetSystem}
                sx={{ py: 1.25, borderRadius: "999px", fontWeight: 800, boxShadow: "none" }}
              >
                Reset system
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            System seed and reset are available only to super administrators. Contact a super admin if you need a fresh demo dataset.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={closeSettings} disabled={!!maintLoading} sx={{ borderRadius: "999px" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default AppSidebar;
