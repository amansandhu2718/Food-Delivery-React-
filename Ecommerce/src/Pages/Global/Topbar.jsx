import {
  Box,
  IconButton,
  InputBase,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, GetColors } from "../../utils/Theme";
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

import { useLocation } from "react-router-dom"; // Added

const Topbar = (props) => {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const location = useLocation(); // Added

  const isHomePage = location.pathname === "/" || location.pathname === "/browse";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        // alignItems: "center",
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
        }}
      >
        {isMobile && (
          <IconButton onClick={() => props.SetOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}
        <Box
          sx={{
            marginLeft: 1,
            display: "flex",
            backgroundColor: colors.primary[300],
            borderRadius: "3px",
            transition: "border-color 0.2s ease",
            "&:focus-within": {
              outline: "2px solid " + colors.grey[300],
            },
          }}
        >
          <LocationSelector />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              transition: "max-width 0.5s ease-in-out, opacity 0.5s ease-in-out",
              maxWidth: isHomePage ? 0 : "400px",
              opacity: isHomePage ? 0 : 1,
              overflow: "hidden",
            }}
          >
            <InputBase
              placeholder="Search"
              sx={{
                ml: 2,
                flex: 1,
                display: isMobile ? "none" : "flex",
                whiteSpace: "nowrap",
              }}
            />
            <Tooltip title="Search">
              <IconButton
                type="button"
                sx={{ p: 1, display: isMobile ? "none" : "block" }}
              >
                <SearchOutlinedIcon
                  sx={{
                    display: isMobile ? "none" : "block",
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
        }}
      >
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode == "dark" ? (
            <>
              <Tooltip title="Light Mode">
                <DarkModeOutlinedIcon />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="Dark Mode">
                <LightModeOutlinedIcon />
              </Tooltip>
            </>
          )}
        </IconButton>
        <Badge color="error" overlap="circular" badgeContent="2">
          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Badge>
        <Tooltip title="AI Assistant">
          <IconButton onClick={() => setAiChatOpen(true)}>
            <AutoAwesomeIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <AIChatDialog open={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </Box>
    // </Box>
  );
};
export default Topbar;
