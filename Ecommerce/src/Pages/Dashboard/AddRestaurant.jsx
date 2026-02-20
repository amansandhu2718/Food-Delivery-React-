import {
    Box,
    Button,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
    Autocomplete,
    Chip,
    Divider,
    IconButton,
    Paper,
    Switch,
    FormControlLabel, // Keep FormControlLabel as it's used with Switch
} from "@mui/material";
import Header from "../../Components/Header";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import { GetColors } from "../../utils/Theme";
import { toast, Bounce } from "react-toastify";
import api from "../../utils/api";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const AddRestaurant = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const colors = GetColors(theme.palette.mode);
    const navigate = useNavigate();

    const initialValues = {
        title: "",
        location: "",
        contact: "",
        lat: "",
        long: "",
        image: "",
        rating: "",
        cuisine: [],
        deliveryTime: "",
        priceForTwo: "",
        isOpen: true,
        isVeg: false,
        hasOffer: false,
        promo: "",
        items: [
            {
                title: "",
                price: "",
                category: "",
                menuCategory: "",
                image: "",
                rating: 4,
                hasOffer: false,
                promo: "",
            },
        ],
    };

    const itemSchema = yup.object().shape({
        title: yup.string().required("required"),
        price: yup.number().required("required"),
        category: yup.string().required("required"),
        menuCategory: yup.string().required("required"),
        image: yup.string().url("Invalid URL").required("required"),
        rating: yup.number().min(0).max(5).required("required"),
        hasOffer: yup.boolean(),
        promo: yup.string(),
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
            // 1. Create Restaurant
            const restaurantRes = await api.post("/api/restaurants", {
                ...values,
                items: undefined, // Don't send items yet
            });
            const restaurantId = restaurantRes.data.id;

            // 2. Create Items
            const itemPromises = values.items.map((item) =>
                api.post("/api/products", { ...item, restaurantId })
            );
            await Promise.all(itemPromises);

            toast.success("Restaurant and Menu Created Successfully", {
                position: "top-right",
                autoClose: 3000,
                theme: theme.palette.mode === "dark" ? "dark" : "colored",
                transition: Bounce,
            });
            navigate("/admin/restaurants");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create restaurant");
        } finally {
            setSubmitting(false);
        }
    };

    const commonCuisines = [
        "North Indian",
        "South Indian",
        "Chinese",
        "Italian",
        "Continental",
        "Fast Food",
        "Beverages",
        "Desserts",
        "Street Food",
        "Mughlai",
    ];

    return (
        <Box sx={{ padding: 3, width: "100%" }}>
            <Header title="ADD RESTAURANT" subtitle="Create restaurant and initial menu" />
            <Box sx={{ width: "100%", marginTop: "30px" }}>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
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
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gap: "20px",
                                            gridTemplateColumns: "repeat(2, 1fr)",
                                        }}
                                    >
                                        <TextField
                                            fullWidth variant="filled" label="Title" onBlur={handleBlur} onChange={handleChange} value={values.title} name="title"
                                            error={!!touched.title && !!errors.title} helperText={touched.title && errors.title}
                                        />
                                        <TextField
                                            fullWidth variant="filled" label="Contact" onBlur={handleBlur} onChange={handleChange} value={values.contact} name="contact"
                                            error={!!touched.contact && !!errors.contact} helperText={touched.contact && errors.contact}
                                        />
                                        <TextField
                                            fullWidth variant="filled" label="Location" onBlur={handleBlur} onChange={handleChange} value={values.location} name="location"
                                            error={!!touched.location && !!errors.location} helperText={touched.location && errors.location} sx={{ gridColumn: "span 2" }}
                                        />
                                        <TextField
                                            fullWidth variant="filled" type="number" label="Latitude" onBlur={handleBlur} onChange={handleChange} value={values.lat} name="lat"
                                            error={!!touched.lat && !!errors.lat} helperText={touched.lat && errors.lat}
                                        />
                                        <TextField
                                            fullWidth variant="filled" type="number" label="Longitude" onBlur={handleBlur} onChange={handleChange} value={values.long} name="long"
                                            error={!!touched.long && !!errors.long} helperText={touched.long && errors.long}
                                        />
                                        <TextField
                                            fullWidth variant="filled" label="Image URL" onBlur={handleBlur} onChange={handleChange} value={values.image} name="image"
                                            error={!!touched.image && !!errors.image} helperText={touched.image && errors.image} sx={{ gridColumn: "span 2" }}
                                        />
                                        <TextField
                                            fullWidth variant="filled" type="number" label="Rating" onBlur={handleBlur} onChange={handleChange} value={values.rating} name="rating"
                                            error={!!touched.rating && !!errors.rating} helperText={touched.rating && errors.rating}
                                        />
                                        <TextField
                                            fullWidth variant="filled" type="number" label="Delivery Time" onBlur={handleBlur} onChange={handleChange} value={values.deliveryTime} name="deliveryTime"
                                            error={!!touched.deliveryTime && !!errors.deliveryTime} helperText={touched.deliveryTime && errors.deliveryTime}
                                        />
                                        <TextField
                                            fullWidth variant="filled" type="number" label="Price for Two" onBlur={handleBlur} onChange={handleChange} value={values.priceForTwo} name="priceForTwo"
                                            error={!!touched.priceForTwo && !!errors.priceForTwo} helperText={touched.priceForTwo && errors.priceForTwo}
                                        />
                                        <Autocomplete
                                            multiple options={commonCuisines} freeSolo value={values.cuisine}
                                            onChange={(e, v) => setFieldValue("cuisine", v)}
                                            renderTags={(v, p) => v.map((o, i) => <Chip label={o} {...p({ index: i })} key={o} />)}
                                            renderInput={(p) => <TextField {...p} variant="filled" label="Cuisines" error={!!touched.cuisine && !!errors.cuisine} helperText={touched.cuisine && errors.cuisine} />}
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
                                                    label="Special Offer"
                                                />
                                            </Box>
                                            {values.hasOffer && (
                                                <TextField
                                                    fullWidth
                                                    variant="filled"
                                                    label="Promo Text (e.g. 50% OFF)"
                                                    onChange={handleChange}
                                                    value={values.promo}
                                                    name="promo"
                                                    sx={{ mt: 2 }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Right Side: Menu Items */}
                                <Box flex={1.5}>
                                    <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" mb={2}>
                                        Menu Items (At least 1 required)
                                    </Typography>
                                    <FieldArray name="items">
                                        {({ push, remove }) => (
                                            <Box>
                                                {values.items.map((item, index) => (
                                                    <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: colors.primary[400] }}>
                                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                            <Typography variant="h6">Item #{index + 1}</Typography>
                                                            {values.items.length > 1 && (
                                                                <IconButton onClick={() => remove(index)} color="error">
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            )}
                                                        </Box>
                                                        <Box display="grid" gap="15px" gridTemplateColumns="repeat(2, 1fr)">
                                                            <TextField
                                                                fullWidth variant="outlined" label="Item Title"
                                                                name={`items.${index}.title`} value={item.title} onChange={handleChange}
                                                                error={touched.items?.[index]?.title && !!errors.items?.[index]?.title}
                                                            />
                                                            <TextField
                                                                fullWidth variant="outlined" type="number" label="Price"
                                                                name={`items.${index}.price`} value={item.price} onChange={handleChange}
                                                                error={touched.items?.[index]?.price && !!errors.items?.[index]?.price}
                                                            />
                                                            <TextField
                                                                fullWidth variant="outlined" label="Category"
                                                                name={`items.${index}.category`} value={item.category} onChange={handleChange}
                                                                error={touched.items?.[index]?.category && !!errors.items?.[index]?.category}
                                                            />
                                                            <TextField
                                                                fullWidth variant="outlined" label="Menu Category"
                                                                name={`items.${index}.menuCategory`} value={item.menuCategory} onChange={handleChange}
                                                                error={touched.items?.[index]?.menuCategory && !!errors.items?.[index]?.menuCategory}
                                                            />
                                                            <TextField
                                                                fullWidth variant="outlined" label="Image URL"
                                                                name={`items.${index}.image`} value={item.image} onChange={handleChange}
                                                                error={touched.items?.[index]?.image && !!errors.items?.[index]?.image} sx={{ gridColumn: "span 2" }}
                                                            />
                                                        </Box>
                                                    </Paper>
                                                ))}
                                                <Button
                                                    variant="outlined" color="info" startIcon={<AddIcon />}
                                                    onClick={() => push({ title: "", price: "", category: "", menuCategory: "", image: "", rating: 4, hasOffer: false, promo: "" })}
                                                >
                                                    Add Another Item
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
                                    {isSubmitting ? "Creating..." : "Create Restaurant & Menu"}
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default AddRestaurant;
