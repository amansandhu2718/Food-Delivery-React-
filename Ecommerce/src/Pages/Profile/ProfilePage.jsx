import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  Avatar,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../utils/api";
import { useSelector } from "react-redux";

function ProfilePage() {
  const theme = useTheme();
  const { isAuthenticated, user: loginInfo } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(loginInfo?.name || "");

  const [formData, setFormData] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    label: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
    if (loginInfo) setNewName(loginInfo.name);
  }, [loginInfo]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/addresses");
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    try {
      await api.put("/api/auth/profile", { name: newName });
      alert("Name updated successfully!");
      setIsEditingName(false);
    } catch (err) {
      console.error("Failed to update name", err);
      alert("Failed to update name");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      await api.put("/api/auth/profile", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile image updated");
    } catch (err) {
      console.error("Failed to upload image", err);
      alert("Failed to upload image");
    }
  };

  const handleOpenDialog = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        addressLine: address.addressLine || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        label: address.label || "",
        isDefault: address.isDefault || false,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        label: "",
        isDefault: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await api.put(`/api/addresses/${editingAddress.id}`, formData);
      } else {
        await api.post("/api/addresses", formData);
      }
      await fetchAddresses();
      handleCloseDialog();
    } catch (err) {
      console.error("Failed to save address", err);
      alert("Failed to save address");
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      await api.delete(`/api/addresses/${addressId}`);
      await fetchAddresses();
    } catch (err) {
      console.error("Failed to delete address", err);
      alert("Failed to delete address");
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          setFormData((prev) => ({ ...prev, lat, long }));
          alert(`Location captured: ${lat.toFixed(4)}, ${long.toFixed(4)}`);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Unable to get your location");
        },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const profileImageUrl = loginInfo?.profile_image
    ? loginInfo.profile_image.startsWith("http")
      ? loginInfo.profile_image
      : `http://localhost:5001${loginInfo.profile_image}`
    : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={900} mb={4} sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        My Profile
      </Typography>

      {/* Profile Details Card */}
      <Card sx={{ mb: 4, bgcolor: "background.paper", borderRadius: "32px", border: "1px solid " + (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)") }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems="center"
            gap={4}
          >
            <Box position="relative">
              <Avatar
                src={profileImageUrl}
                sx={{
                  width: 140,
                  height: 140,
                  fontSize: "3.5rem",
                  bgcolor: "primary.main",
                  fontWeight: 800,
                  border: "4px solid " + theme.palette.background.paper,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                {loginInfo?.name?.charAt(0)}
              </Avatar>
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  bgcolor: "secondary.main",
                  "&:hover": { bgcolor: "secondary.dark" },
                  color: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <PhotoCameraIcon />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Box>

            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                {isEditingName ? (
                  <>
                    <TextField
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      size="small"
                      autoFocus
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                    <IconButton color="success" onClick={handleUpdateName}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(loginInfo?.name || "");
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Typography variant="h4" fontWeight={900} sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {loginInfo?.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setIsEditingName(true)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
              <Typography variant="body1" color="text.secondary" fontWeight={600} mb={2}>
                {loginInfo?.email}
              </Typography>
              <Chip
                label={loginInfo?.role || "USER"}
                size="small"
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 900,
                  px: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.65rem",
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 6, opacity: 0.1 }} />

      {/* Addresses Card */}
      <Card sx={{ mb: 4, bgcolor: "background.paper", borderRadius: "32px", border: "1px solid " + (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)") }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant="h5" fontWeight={800} sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Saved Addresses
            </Typography>
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: "primary.main",
                borderRadius: "100px",
                px: 3,
                py: 1,
                fontWeight: 800,
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Add Address
            </Button>
          </Box>

          {addresses.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: "16px", fontWeight: 600 }}>
              No addresses saved. Add your first address!
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {addresses.map((address) => (
                <Grid item xs={12} sm={6} md={4} key={address.id}>
                  <Card
                    sx={{
                      p: 3,
                      height: "100%",
                      bgcolor: address.isDefault ? "rgba(1, 128, 41, 0.03)" : "background.default",
                      border: address.isDefault
                        ? `2px solid ${theme.palette.primary.main}`
                        : "1px solid " + (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                      position: "relative",
                      borderRadius: "24px",
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-4px)" },
                    }}
                  >
                    {address.isDefault && (
                      <Chip
                        label="DEFAULT"
                        size="small"
                        sx={{ 
                            position: "absolute", 
                            top: 16, 
                            right: 16, 
                            bgcolor: "primary.main", 
                            color: "white",
                            fontWeight: 900,
                            fontSize: "0.6rem"
                        }}
                      />
                    )}
                    <Box display="flex" alignItems="start" mb={1}>
                      <LocationOnIcon sx={{ color: "primary.main", mr: 1.5, mt: 0.5 }} />
                      <Box flex={1}>
                        {address.label && (
                          <Typography
                            variant="subtitle1"
                            fontWeight={800}
                            mb={0.5}
                            sx={{ color: "text.primary" }}
                          >
                            {address.label}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ lineHeight: 1.6 }}>
                          {address.addressLine}
                        </Typography>
                        {(address.city || address.state || address.pincode) && (
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            {[address.city, address.state, address.pincode]
                              .filter(Boolean)
                              .join(", ")}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box display="flex" gap={1} mt={3}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(address)}
                        sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(address.id)}
                        sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Address Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "32px", p: 2 }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 900, fontSize: "1.5rem" }}>
            {editingAddress ? "Edit Journal Entry" : "New Archive Point"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
            >
              <TextField
                label="Label (e.g., Home, Office)"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                label="Address Line"
                value={formData.addressLine}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine: e.target.value })
                }
                required
                fullWidth
                multiline
                rows={3}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="City"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="State"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Grid>
              </Grid>
              <TextField
                label="Pincode"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <Button
                type="button"
                variant="outlined"
                startIcon={<LocationOnIcon />}
                onClick={handleGetLocation}
                fullWidth
                sx={{ 
                    borderRadius: "100px", 
                    py: 1.5, 
                    fontWeight: 800,
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": { borderColor: "primary.dark", bgcolor: "rgba(1, 128, 41, 0.04)" }
                }}
              >
                Get Current Location
              </Button>
              <Box display="flex" alignItems="center">
                <input
                  type="checkbox"
                  id="isDefaultProfile"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
                <label htmlFor="isDefaultProfile" style={{ marginLeft: 12, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
                  Set as default address
                </label>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 4 }}>
            <Button onClick={handleCloseDialog} sx={{ fontWeight: 800, color: "text.secondary" }}>Cancel</Button>
            <Button 
                type="submit" 
                variant="contained" 
                disableElevation
                sx={{ 
                    borderRadius: "100px", 
                    px: 6, 
                    py: 1.5, 
                    fontWeight: 900,
                    bgcolor: "secondary.main",
                    "&:hover": { bgcolor: "secondary.dark" }
                }}
            >
              {editingAddress ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default ProfilePage;
