import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { GetColors } from "../../utils/Theme";
import api from "../../utils/api";
import { clearAccessToken } from "../../utils/authService";
import { useLoginInfo } from "../../utils/CustomHooks";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
const drawerWidth = 260;

const AppSidebar = ({ open, SetOpen, data }) => {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [loginInfo, SetLoginInfo] = useLoginInfo();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout", {});
    } catch (e) {
      // ignore
    }
    clearAccessToken();
    SetLoginInfo(null);
    navigate("/login", { replace: true });
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        backgroundColor: colors.primary[400],
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
      <Box sx={{ p: 2, textAlign: "center", color: colors.Font[400] }}>
        <AccountCircleIcon sx={{ fontSize: 80, color: colors.Font[400] }} />
        <Typography variant="h5">{loginInfo?.name || "User"}</Typography>
        <Typography variant="h6" color={colors.Font[500]}>
          {loginInfo?.email || "user@email.com"}
        </Typography>
      </Box>

      {/* Icons */}
      <Divider
        variant="middle"
        sx={{
          backgroundColor: colors.Font[400],
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <IconButton sx={{ color: colors.Font[400] }}>
          <FlagCircleIcon />
        </IconButton>
        <IconButton sx={{ color: colors.Font[400] }}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton sx={{ color: colors.Font[400] }} onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>
      <Divider
        variant="middle"
        sx={{
          backgroundColor: colors.Font[400],
        }}
      />
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
                    m: "15px 0 5px 20px",
                    color: colors.Font[500],
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontSize: "0.75rem",
                    fontWeight: "bold"
                  }}
                >
                  {item.label}
                </Typography>
              );
            }

            let active = location.pathname === item.path;

            // Handle special cases for highlighting
            if (item.path === "/admin/dashboard" && (location.pathname === "/admin/" || location.pathname === "/admin/dashboard")) {
              active = true;
            } else if (item.path === "/" && (location.pathname === "/" || location.pathname === "/browse")) {
              active = true;
            }

            // Highlight "Search Food" when on a food-related page
            if (item.path === "/ExploreFood" && (location.pathname === "/ExploreFood" || location.pathname.startsWith("/food/"))) {
              active = true;
            }

            // Highlight "Explore Restaurants" when on a menu-related page
            if ((item.path === "/explore" || item.path === "/Explore") &&
              (location.pathname === "/explore" || location.pathname === "/Explore" || location.pathname.startsWith("/menu/"))) {
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
                  borderRadius: 3,
                  margin: "2px 10px",
                  color: colors.Font[400],
                  "&.Mui-selected": {
                    backgroundColor: "#6f6b9477",
                    color: colors.Font[500],
                    fontWeight: 600,
                  },
                  "&:hover": {
                    backgroundColor: "#ffffff11",
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
      <Box>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? open : true}
          onClose={() => SetOpen(false)}
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: colors.primary[400],
              border: "none",
              height: "100%",
              overflow: "hidden", // Let inner Box handle scroll
            },
            "& .MuiBackdrop-root": {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default AppSidebar;
