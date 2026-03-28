import {
  Box,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/Slices/themeSlice";
import { GetColors } from "../../utils/Theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Badge from "@mui/material/Badge";
import LocationSelector from "../../Components/LocationSelector";
import AIChatDialog from "../../Components/AIChatDialog";

import { useNavigate } from "react-router-dom"; // Added

const Topbar = (props) => {
  const theme = useTheme();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        bgcolor: "background.paper",
        borderBottom:
          "1px solid " +
          (theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)"),
        boxShadow:
          theme.palette.mode === "light"
            ? "0 2px 10px rgba(0,0,0,0.02)"
            : "none",
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {isMobile && (
          <IconButton onClick={() => props.SetOpen(true)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
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
          onClick={() => Navigate("/")}
        >
          Cravvy
          <Box component="span" sx={{ color: "secondary.main" }}>
            .
          </Box>
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton
          onClick={() => dispatch(toggleTheme())}
          sx={{ border: "1px solid " + theme.palette.divider }}
        >
          {theme.palette.mode == "dark" ? (
            <Tooltip title="Light Mode">
              <DarkModeOutlinedIcon fontSize="small" />
            </Tooltip>
          ) : (
            <Tooltip title="Dark Mode">
              <LightModeOutlinedIcon fontSize="small" />
            </Tooltip>
          )}
        </IconButton>

        <Badge
          color="error"
          overlap="circular"
          badgeContent="2"
          sx={{ "& .MuiBadge-badge": { fontWeight: 900, fontSize: "0.6rem" } }}
        >
          <Tooltip title="Notifications">
            <IconButton sx={{ border: "1px solid " + theme.palette.divider }}>
              <NotificationsOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Badge>

        <Tooltip title="AI Assistant">
          <IconButton
            onClick={() => setAiChatOpen(true)}
            sx={{
              bgcolor: "secondary.main",
              color: "white",
              "&:hover": { bgcolor: "secondary.dark" },
            }}
          >
            <AutoAwesomeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <AIChatDialog open={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </Box>
    // </Box>
  );
};
export default Topbar;
