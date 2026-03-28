import {
  Box,
  Typography,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useState, useEffect } from "react";
import api from "../utils/api";

import { GetColors } from "../utils/Theme";
import { useSelector } from "react-redux";

const popularLocations = [
  "Indiranagar, Bangalore",
  "Koramangala, Bangalore",
  "Whitefield, Bangalore",
  "HSR Layout, Bangalore",
  "MG Road, Bangalore",
];

const LocationSelector = ({ headerMode = false }) => {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [location, setLocation] = useState("Select Location");
  const [addressLabel, setAddressLabel] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  // const [loading, setLoading] = useState(true);
  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchCurrentLocation();
    fetchSavedAddresses();
  }, []);

  const fetchCurrentLocation = async () => {
    try {
      if (!isAuthenticated || loading) return;
      const res = await api.get("/api/addresses/current");
      if (res.data) {
        console.log("LOCATION:", res.data);
        const { addressLine, city, state, pincode, location, label } = res.data;
        const fullAddress = addressLine
          ? `${addressLine}${city ? ", " + city : ""}${state ? ", " + state : ""}${pincode ? " - " + pincode : ""}`
          : location;
        setLocation(fullAddress || "Select Location");
        setAddressLabel(label || "");
      }
    } catch (err) {
      console.error("Failed to fetch current location", err);
    }
  };

  const fetchSavedAddresses = async () => {
    try {
      if (!isAuthenticated || loading) return;
      const res = await api.get("/api/addresses");
      console.log("SAVED: LOCATION:", res);

      setSavedAddresses(res.data || []);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchSavedAddresses();
  };

  const handleClose = async (
    value,
    lat,
    long,
    addressId = null,
    label = null,
  ) => {
    if (value || addressId) {
      if (value) setLocation(value.split(",")[0]);
      if (label) setAddressLabel(label);
      else if (addressId === null) setAddressLabel("GPS"); // Default for current location

      // Save location to backend
      console.log("Selected location:", value, lat, long, addressId);
      if (isAuthenticated) {
        try {
          await api.put("/api/addresses/current", {
            addressId,
            location: value,
            lat,
            long,
          });
          // Trigger location change event for restaurant filtering
          window.dispatchEvent(
            new CustomEvent("locationChanged", { detail: { lat, long } }),
          );
          fetchCurrentLocation();
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
            4,
          )}, ${long.toFixed(4)})`;
          await handleClose(locationName, lat, long);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Unable to get your location. Please select from list.");
        },
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
          // width: "10rem",
        }}
      >
        <Box
          sx={{
            bgcolor: headerMode ? (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(1, 128, 41, 0.08)") : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 35,
            height: 35,
            borderRadius: "50%",
            mr: 1,
            transition: "all 0.3s ease",
          }}
        >
          <LocationOnOutlinedIcon
            sx={{ color: headerMode ? "primary.main" : "error.main" }}
          />
        </Box>
        {loading ? (
          <CircularProgress size={16} sx={{ ml: 0.5 }} />
        ) : (
          <Box sx={{ ml: 0.5, overflow: "hidden", flex: 1 }}>
            <Typography
              variant="caption"
              fontWeight={900}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                lineHeight: 1,
                fontSize: "0.9rem",
                textTransform: "capitalize",
                color: "text.primary",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              {addressLabel || "Discovery"}
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: "1.2rem",
                  color: "primary.main",
                  transition: "transform 0.3s ease",
                  transform: open ? "rotate(180deg)" : "none",
                }}
              />
            </Typography>
            <Typography
              fontWeight={600}
              noWrap
              sx={{
                maxWidth: 250,
                display: "block",
                fontSize: "0.7rem",
                color: "text.secondary",
                opacity: 0.8,
              }}
            >
              {location}
            </Typography>
          </Box>
        )}
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
                  handleClose(
                    addr.addressLine,
                    addr.lat,
                    addr.long,
                    addr.id,
                    addr.label,
                  )
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
