import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  InputAdornment, 
  Divider,
  Fade,
  useTheme
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import api from "../utils/api";
import { setLocation } from "../redux/slices/locationSlice";

const LocationGuard = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { location, lat, long } = useSelector((state) => state.location);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // If authenticated but no location, show modal
    if (isAuthenticated && (!location || location === "Select Location")) {
      checkCurrentLocation();
    } else {
      setShowModal(false);
    }
  }, [isAuthenticated, location]);

  const checkCurrentLocation = async () => {
    try {
      const res = await api.get("/api/addresses/current");
      if (res.data && res.data.location && res.data.location !== "Select Location") {
        dispatch(setLocation({
          location: res.data.location,
          lat: res.data.lat,
          long: res.data.long,
          label: res.data.label
        }));
        setShowModal(false);
      } else {
        setShowModal(true);
      }
    } catch (err) {
      console.error("Failed to check location", err);
      setShowModal(true);
    }
  };

  const handleSelectLocation = async (loc, latitude, longitude, label = "GPS") => {
    try {
      if (isAuthenticated) {
        await api.put("/api/addresses/current", {
          location: loc,
          lat: latitude,
          long: longitude
        });
      }
      dispatch(setLocation({
        location: loc,
        lat: latitude,
        long: longitude,
        label: label
      }));
      
      // Notify components like Browse.jsx
      window.dispatchEvent(new CustomEvent("locationChanged", { detail: { lat: latitude, long: longitude } }));
      
      setShowModal(false);
    } catch (err) {
      console.error("Failed to select location", err);
    }
  };

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleSelectLocation("My Current Location", pos.coords.latitude, pos.coords.longitude, "GPS");
        },
        (err) => {
          alert("Unable to get GPS location. Please select manually.");
        }
      );
    }
  };

  // Popular locations for quick selection
  const popular = [
    { name: "Indiranagar, Bangalore", lat: 12.9719, lng: 77.6412 },
    { name: "Whitefield, Bangalore", lat: 12.9698, lng: 77.7500 },
    { name: "Cyber City, Gurgaon", lat: 28.4950, lng: 77.0878 },
  ];

  if (!isAuthenticated) return children;

  return (
    <>
      {children}
      <Dialog 
        open={showModal} 
        onClose={() => {}} // Force selection
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 2,
            color: 'primary.main'
          }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h5" fontWeight={900}>Where should we deliver?</Typography>
          <Typography variant="body2" color="text.secondary">
            Please pick a location to see nearby flavors.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<MyLocationIcon />}
              onClick={handleGPS}
              sx={{ 
                py: 1.5, 
                borderRadius: 2,
                mb: 2,
                textTransform: 'none',
                fontWeight: 800
              }}
            >
              Use My Current Location
            </Button>
            
            <Divider sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ px: 1, color: "text.secondary" }}>OR PICK SOMEWHERE ELSE</Typography>
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {popular.map((loc) => (
                <Button
                  key={loc.name}
                  onClick={() => handleSelectLocation(loc.name, loc.lat, loc.lng, "Popular")}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    color: 'text.primary',
                    textTransform: 'none',
                    "&:hover": {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText'
                    }
                  }}
                >
                  <LocationOnOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                  {loc.name}
                </Button>
              ))}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationGuard;
