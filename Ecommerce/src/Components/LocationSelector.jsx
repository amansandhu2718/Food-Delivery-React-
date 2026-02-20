import {
  Box,
  Typography,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Divider,
  CircularProgress,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useState, useEffect } from "react";
import api from "../utils/api";
import { useLoginInfo } from "../utils/CustomHooks";
import { getAccessToken } from "../utils/authService";

const popularLocations = [
  "Indiranagar, Bangalore",
  "Koramangala, Bangalore",
  "Whitefield, Bangalore",
  "HSR Layout, Bangalore",
  "MG Road, Bangalore",
];

const LocationSelector = () => {
  const [loginInfo] = useLoginInfo();
  const [anchorEl, setAnchorEl] = useState(null);
  const [location, setLocation] = useState("Select Location");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchCurrentLocation();
    fetchSavedAddresses();
  }, []);

  const fetchCurrentLocation = async () => {
    try {
      if (!loginInfo) return;
      if (!getAccessToken()) return;
      const res = await api.get("/api/addresses/current");
      if (res.data?.location) {
        setLocation(res.data.location);
      }
    } catch (err) {
      console.error("Failed to fetch current location", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedAddresses = async () => {
    try {
      if (!loginInfo) return;
      const res = await api.get("/api/addresses");
      setSavedAddresses(res.data || []);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchSavedAddresses();
  };

  const handleClose = async (value, lat, long) => {
    if (value) {
      setLocation(value);
      // Save location to backend
      console.log("Selected location:", value, lat, long);
      if (loginInfo) {
        try {
          await api.put("/api/addresses/current", {
            location: value,
            lat,
            long,
          });
          // Trigger location change event for restaurant filtering
          window.dispatchEvent(
            new CustomEvent("locationChanged", { detail: { lat, long } })
          );
        } catch (err) {
          console.error("Failed to save location", err);
        }
      }
    }
    setAnchorEl(null);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          // Reverse geocode to get address (simplified - in production use a geocoding service)
          const locationName = `Current Location (${lat.toFixed(
            4
          )}, ${long.toFixed(4)})`;
          await handleClose(locationName, lat, long);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Unable to get your location. Please select from list.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <>
      {/* Trigger */}
      <Box
        onClick={handleOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          p: 1,
          borderRadius: 2,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <LocationOnOutlinedIcon color="error" />
        {loading ? (
          <CircularProgress size={16} sx={{ ml: 0.5 }} />
        ) : (
          <Typography fontWeight={600} ml={0.5}>
            {location.split(",")[0]}
          </Typography>
        )}
        <KeyboardArrowDownIcon />
      </Box>

      {/* Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        PaperProps={{
          sx: {
            width: 320,
            p: 1,
            borderRadius: 3,
          },
        }}
      >
        <MenuItem>
          <TextField
            fullWidth
            size="small"
            placeholder="Search location"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </MenuItem>

        <MenuItem onClick={handleCurrentLocation}>
          <MyLocationIcon fontSize="small" sx={{ mr: 1 }} />
          Use current location
        </MenuItem>

        {savedAddresses.length > 0 && (
          <Box>
            <Divider sx={{ my: 1 }} />
            <Typography
              variant="caption"
              sx={{ px: 2, color: "text.secondary" }}
            >
              SAVED ADDRESSES
            </Typography>
            {savedAddresses.map((addr) => (
              <MenuItem
                key={addr.id}
                onClick={() =>
                  handleClose(addr.addressLine, addr.lat, addr.long)
                }
              >
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {addr.label || "Home"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {addr.addressLine}
                    {addr.city && `, ${addr.city}`}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Typography variant="caption" sx={{ px: 2, color: "text.secondary" }}>
          POPULAR LOCATIONS
        </Typography>

        {popularLocations.map((loc) => (
          <MenuItem key={loc} onClick={() => handleClose(loc)}>
            {loc}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LocationSelector;
