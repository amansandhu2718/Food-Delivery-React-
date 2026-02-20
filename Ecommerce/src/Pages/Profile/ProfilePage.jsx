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
import { GetColors } from "../../utils/Theme";
import { useLoginInfo } from "../../utils/CustomHooks";

function ProfilePage() {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const [loginInfo, setLoginInfo] = useLoginInfo();
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
      const res = await api.put("/api/auth/profile", { name: newName });
      setLoginInfo(res.data.user);
      setIsEditingName(false);
      alert("Name updated successfully");
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
      const res = await api.put("/api/auth/profile", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoginInfo(res.data.user);
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
    if (!window.confirm("Are you sure you want to delete this address?")) return;

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
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const profileImageUrl = loginInfo?.profile_image
    ? (loginInfo.profile_image.startsWith('http') ? loginInfo.profile_image : `http://localhost:5001${loginInfo.profile_image}`)
    : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        My Profile
      </Typography>

      {/* Profile Details Card */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: '12px' }}>
        <CardContent>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={4}>
            <Box position="relative">
              <Avatar
                src={profileImageUrl}
                sx={{ width: 120, height: 120, fontSize: '3rem', bgcolor: colors.primary[500] }}
              >
                {loginInfo?.name?.charAt(0)}
              </Avatar>
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: colors.greenAccent[500],
                  "&:hover": { bgcolor: colors.greenAccent[600] },
                  color: "white"
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
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                {isEditingName ? (
                  <>
                    <TextField
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      size="small"
                      autoFocus
                    />
                    <IconButton color="success" onClick={handleUpdateName}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => { setIsEditingName(false); setNewName(loginInfo.name); }}>
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Typography variant="h5" fontWeight={700}>
                      {loginInfo?.name}
                    </Typography>
                    <IconButton size="small" onClick={() => setIsEditingName(true)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
              <Typography variant="body1" color="text.secondary" mb={1}>
                {loginInfo?.email}
              </Typography>
              <Chip
                label={loginInfo?.role}
                size="small"
                sx={{ bgcolor: colors.primary[500], color: "white", fontWeight: "bold" }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 4 }} />

      {/* Addresses Card */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: '12px' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600}>
              Saved Addresses
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ bgcolor: colors.greenAccent[500], "&:hover": { bgcolor: colors.greenAccent[600] } }}
            >
              Add Address
            </Button>
          </Box>

          {addresses.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: '8px' }}>No addresses saved. Add your first address!</Alert>
          ) : (
            <Grid container spacing={2}>
              {addresses.map((address) => (
                <Grid item xs={12} sm={6} md={4} key={address.id}>
                  <Card
                    sx={{
                      p: 2,
                      height: '100%',
                      border: address.isDefault ? `2px solid ${colors.greenAccent[500]}` : "1px solid",
                      borderColor: address.isDefault ? colors.greenAccent[500] : "divider",
                      position: "relative",
                      borderRadius: '10px'
                    }}
                  >
                    {address.isDefault && (
                      <Chip
                        label="Default"
                        size="small"
                        color="success"
                        sx={{ position: "absolute", top: 8, right: 8 }}
                      />
                    )}
                    <Box display="flex" alignItems="start" mb={1}>
                      <LocationOnIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                      <Box flex={1}>
                        {address.label && (
                          <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                            {address.label}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {address.addressLine}
                        </Typography>
                        {(address.city || address.state || address.pincode) && (
                          <Typography variant="body2" color="text.secondary">
                            {[address.city, address.state, address.pincode]
                              .filter(Boolean)
                              .join(", ")}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box display="flex" gap={1} mt={2}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(address)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(address.id)}
                        color="error"
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingAddress ? "Edit Address" : "Add New Address"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              <TextField
                label="Label (e.g., Home, Office)"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                fullWidth
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
                rows={2}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <TextField
                label="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                fullWidth
              />
              <Button
                type="button"
                variant="outlined"
                startIcon={<LocationOnIcon />}
                onClick={handleGetLocation}
                fullWidth
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
                />
                <label htmlFor="isDefaultProfile" style={{ marginLeft: 8 }}>
                  Set as default address
                </label>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingAddress ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default ProfilePage;
