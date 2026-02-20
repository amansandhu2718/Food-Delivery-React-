import {
    Box,
    Button,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
    FormControlLabel,
    Autocomplete,
    Chip,
    IconButton,
    Paper,
    CircularProgress,
    Switch,
} from "@mui/material";
import Header from "../../Components/Header";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import { GetColors } from "../../utils/Theme";
import { toast, Bounce } from "react-toastify";
import api from "../../utils/api";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const EditRestaurant = () => {
    const { id } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const colors = GetColors(theme.palette.mode);
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resRes, menuRes] = await Promise.all([
                    api.get(`/api/restaurants/${id}`),
                    api.get(`/api/restaurants/${id}/menu`),
                ]);

                setInitialData({
                    ...resRes.data,
                    items: menuRes.data.map(item => ({
                        id: item.id,
                        title: item.name,
                        price: item.price,
                        category: item.category,
                        menuCategory: item.menuCategory,
                        image: item.image,
                        rating: item.rating || 4,
                        hasOffer: item.hasOffer || false,
                        promo: item.promo || "",
                    })),
                });
            } catch (error) {
                toast.error("Failed to load restaurant data");
                navigate("/admin/restaurants");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const itemSchema = yup.object().shape({
        title: yup.string().required("required"),
        price: yup.number().required("required"),
        category: yup.string().required("required"),
        menuCategory: yup.string().required("required"),
        image: yup.string().url("Invalid URL").required("required"),
        rating: yup.number().min(0).max(5).required("required"),
    });

    const validationSchema = yup.object().shape({
        title: yup.string().required("required"),
        location: yup.string().required("required"),
        contact: yup.string().required("required"),
        lat: yup.number().required("required"),
        long: yup.number().required("required"),
        image: yup.string().url("Invalid URL").required("required"),
        rating: yup.number().min(0).max(5).required("required"),
        cuisine: yup.array().min(1, "At least one cuisine is required"),
        deliveryTime: yup.number().required("required"),
        priceForTwo: yup.number().required("required"),
        items: yup.array().of(itemSchema).min(1, "At least one item is required"),
    });

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            // 1. Update Restaurant
            await api.put(`/api/restaurants/${id}`, {
                ...values,
                items: undefined,
            });

            // 2. Sync Menu Items
            // For simplicity in this implementation, we will:
            // - Update existing items (those with IDs)
            // - Create new items (those without IDs)
            // - Items removed from the list won't be deleted from the products table automatically 
            //   (to prevent accidental data loss), but they'll be removed from the restaurant_menu linkage 
            //   if we had a more complex sync. 
            // Actually, a better way is to delete and re-add or just handle updates.
            // Let's stick to updating existing and creating new.

            const itemPromises = values.items.map((item) => {
                if (item.id) {
                    return api.put(`/api/products/${item.id}`, item);
                } else {
                    return api.post("/api/products", { ...item, restaurantId: id });
                }
            });

            await Promise.all(itemPromises);

            toast.success("Restaurant Updated Successfully", {
                position: "top-right",
                autoClose: 3000,
                theme: theme.palette.mode === "dark" ? "dark" : "colored",
                transition: Bounce,
            });
            navigate("/admin/restaurants");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update restaurant");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
            <CircularProgress color="secondary" />
        </Box>
    );

    const commonCuisines = [
        "North Indian", "South Indian", "Chinese", "Italian", "Continental",
        "Fast Food", "Beverages", "Desserts", "Street Food", "Mughlai",
    ];

    return (
        <Box sx={{ padding: 3, width: "100%" }}>
            <Header title="EDIT RESTAURANT" subtitle="Update details and menu" />
            <Box sx={{ width: "100%", marginTop: "30px" }}>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialData}
                    validationSchema={validationSchema}
                    enableReinitialize
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                        isSubmitting,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={4}>
                                {/* Left Side: Restaurant Details */}
                                <Box flex={1}>
                                    <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" mb={2}>
                                        Restaurant Details
                                    </Typography>
                                    <Box sx={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(2, 1fr)" }}>
                                        <TextField fullWidth variant="filled" label="Title" name="title" onBlur={handleBlur} onChange={handleChange} value={values.title} error={!!touched.title && !!errors.title} helperText={touched.title && errors.title} />
                                        <TextField fullWidth variant="filled" label="Contact" name="contact" onBlur={handleBlur} onChange={handleChange} value={values.contact} error={!!touched.contact && !!errors.contact} helperText={touched.contact && errors.contact} />
                                        <TextField fullWidth variant="filled" label="Location" name="location" onBlur={handleBlur} onChange={handleChange} value={values.location} error={!!touched.location && !!errors.location} helperText={touched.location && errors.location} sx={{ gridColumn: "span 2" }} />
                                        <TextField fullWidth variant="filled" type="number" label="Latitude" name="lat" onBlur={handleBlur} onChange={handleChange} value={values.lat} error={!!touched.lat && !!errors.lat} helperText={touched.lat && errors.lat} />
                                        <TextField fullWidth variant="filled" type="number" label="Longitude" name="long" onBlur={handleBlur} onChange={handleChange} value={values.long} error={!!touched.long && !!errors.long} helperText={touched.long && errors.long} />
                                        <TextField fullWidth variant="filled" label="Image URL" name="image" onBlur={handleBlur} onChange={handleChange} value={values.image} error={!!touched.image && !!errors.image} helperText={touched.image && errors.image} sx={{ gridColumn: "span 2" }} />
                                        <TextField fullWidth variant="filled" type="number" label="Rating" name="rating" onBlur={handleBlur} onChange={handleChange} value={values.rating} error={!!touched.rating && !!errors.rating} helperText={touched.rating && errors.rating} />
                                        <TextField fullWidth variant="filled" type="number" label="Delivery Time" name="deliveryTime" onBlur={handleBlur} onChange={handleChange} value={values.deliveryTime} error={!!touched.deliveryTime && !!errors.deliveryTime} helperText={touched.deliveryTime && errors.deliveryTime} />
                                        <TextField fullWidth variant="filled" type="number" label="Price for Two" name="priceForTwo" onBlur={handleBlur} onChange={handleChange} value={values.priceForTwo} error={!!touched.priceForTwo && !!errors.priceForTwo} helperText={touched.priceForTwo && errors.priceForTwo} />
                                        <Autocomplete
                                            multiple options={commonCuisines} freeSolo value={values.cuisine}
                                            onChange={(e, v) => setFieldValue("cuisine", v)}
                                            renderTags={(v, p) => v.map((o, i) => <Chip label={o} {...p({ index: i })} key={o} />)}
                                            renderInput={(p) => <TextField {...p} variant="filled" label="Cuisines" />}
                                        />
                                        <Box sx={{ gridColumn: "span 2", mt: 2 }}>
                                            <Typography variant="body1" fontWeight="600" mb={1} color={colors.grey[200]}>
                                                Restaurant Status & Offers
                                            </Typography>
                                            <Box display="flex" gap={3} flexWrap="wrap">
                                                <FormControlLabel
                                                    control={<Switch checked={values.isOpen} onChange={handleChange} name="isOpen" color="success" />}
                                                    label="Is Open"
                                                />
                                                <FormControlLabel
                                                    control={<Switch checked={values.isVeg} onChange={handleChange} name="isVeg" color="success" />}
                                                    label="Pure Veg"
                                                />
                                                <FormControlLabel
                                                    control={<Switch checked={values.hasOffer} onChange={handleChange} name="hasOffer" color="secondary" />}
                                                    label="Has Offer"
                                                />
                                            </Box>
                                            {values.hasOffer && (
                                                <TextField
                                                    fullWidth
                                                    variant="filled"
                                                    label="Promo Text (e.g. 50% OFF)"
                                                    name="promo"
                                                    onChange={handleChange}
                                                    value={values.promo}
                                                    sx={{ mt: 2 }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Right Side: Menu Items */}
                                <Box flex={1.5}>
                                    <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" mb={2}>
                                        Menu Items
                                    </Typography>
                                    <FieldArray name="items">
                                        {({ push, remove }) => (
                                            <Box>
                                                {values.items.map((item, index) => (
                                                    <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: colors.primary[400] }}>
                                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                            <Typography variant="h6">Item #{index + 1} {item.id ? "(Existing)" : "(New)"}</Typography>
                                                            <IconButton onClick={() => remove(index)} color="error">
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                        <Box display="grid" gap="15px" gridTemplateColumns="repeat(2, 1fr)">
                                                            <TextField fullWidth variant="outlined" label="Title" name={`items.${index}.title`} value={item.title} onChange={handleChange} />
                                                            <TextField fullWidth variant="outlined" type="number" label="Price" name={`items.${index}.price`} value={item.price} onChange={handleChange} />
                                                            <TextField fullWidth variant="outlined" label="Category" name={`items.${index}.category`} value={item.category} onChange={handleChange} />
                                                            <TextField fullWidth variant="outlined" label="Menu Category" name={`items.${index}.menuCategory`} value={item.menuCategory} onChange={handleChange} />
                                                            <TextField fullWidth variant="outlined" label="Image URL" name={`items.${index}.image`} value={item.image} onChange={handleChange} sx={{ gridColumn: "span 2" }} />
                                                        </Box>
                                                    </Paper>
                                                ))}
                                                <Button
                                                    variant="outlined" color="info" startIcon={<AddIcon />}
                                                    onClick={() => push({ title: "", price: "", category: "", menuCategory: "", image: "", rating: 4, hasOffer: false, promo: "" })}
                                                >
                                                    Add Menu Item
                                                </Button>
                                            </Box>
                                        )}
                                    </FieldArray>
                                </Box>
                            </Box>

                            <Box mt={4} display="flex" justifyContent="center">
                                <Button
                                    type="submit" disabled={isSubmitting} variant="contained" size="large"
                                    sx={{ bgcolor: colors.greenAccent[500], px: 6, fontWeight: "bold" }}
                                >
                                    {isSubmitting ? "Updating..." : "Update Restaurant & Menu"}
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default EditRestaurant;
