import {
    Box,
    Button,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
    FormControlLabel,
    Checkbox,
    MenuItem,
    IconButton,
} from "@mui/material";
import Header from "../../Components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { GetColors } from "../../utils/Theme";
import { toast, Bounce } from "react-toastify";
import api from "../../utils/api";
import { useEffect, useState } from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const AddItem = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const colors = GetColors(theme.palette.mode);
    const [restaurants, setRestaurants] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await api.get("/api/restaurants");
                setRestaurants(res.data);
            } catch (error) {
                console.error("Failed to fetch restaurants", error);
            }
        };
        fetchRestaurants();
    }, []);

    const initialValues = {
        title: "",
        price: "",
        category: "",
        menuCategory: "",
        rating: "",
        restaurantId: "",
        hasOffer: false,
        promo: "",
    };

    const validationSchema = yup.object().shape({
        title: yup.string().required("required"),
        price: yup.number().required("required"),
        category: yup.string().required("required"),
        menuCategory: yup.string().required("required"),
        rating: yup.number().min(0).max(5).required("required"),
        restaurantId: yup.string().required("Please select a restaurant"),
        hasOffer: yup.boolean(),
        promo: yup.string(),
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                formData.append(key, values[key]);
            });
            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            await api.post("/api/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Item Created Successfully", {
                position: "top-right",
                autoClose: 3000,
                theme: theme.palette.mode === "dark" ? "dark" : "colored",
                transition: Bounce,
            });
            resetForm();
            setImagePreview(null);
            setSelectedFile(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create item");
        }
    };

    return (
        <Box sx={{ padding: 3, width: "100%" }}>
            <Header title="ADD ITEM" subtitle="Create a new menu item" />
            <Box
                sx={{
                    width: "100%",
                    marginTop: "30px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
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
                    }) => (
                        <form
                            onSubmit={handleSubmit}
                            style={{ width: isMobile ? "100%" : "70%" }}
                        >
                            <Box
                                sx={{
                                    display: "grid",
                                    gap: "20px",
                                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                                    "& > div": {
                                        gridColumn: isMobile ? "span 4" : undefined,
                                    },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Item Title"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.title}
                                    name="title"
                                    error={!!touched.title && !!errors.title}
                                    helperText={touched.title && errors.title}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Price"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.price}
                                    name="price"
                                    error={!!touched.price && !!errors.price}
                                    helperText={touched.price && errors.price}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    select
                                    variant="filled"
                                    label="Associate with Restaurant"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.restaurantId}
                                    name="restaurantId"
                                    error={!!touched.restaurantId && !!errors.restaurantId}
                                    helperText={touched.restaurantId && errors.restaurantId}
                                    sx={{ gridColumn: "span 4" }}
                                >
                                    <MenuItem value="">Choose Restaurant</MenuItem>
                                    {restaurants.map((res) => (
                                        <MenuItem key={res.id} value={res.id}>
                                            {res.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Category (e.g. Pizza, Burger)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.category}
                                    name="category"
                                    error={!!touched.category && !!errors.category}
                                    helperText={touched.category && errors.category}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Menu Category (e.g. Recommended, Main Course)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.menuCategory}
                                    name="menuCategory"
                                    error={!!touched.menuCategory && !!errors.menuCategory}
                                    helperText={touched.menuCategory && errors.menuCategory}
                                    sx={{ gridColumn: "span 2" }}
                                />

                                {/* Image Upload Section */}
                                <Box sx={{ gridColumn: "span 3", display: "flex", gap: 2, alignItems: "center" }}>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<PhotoCameraIcon />}
                                        sx={{ bgcolor: colors.blueAccent[700] }}
                                    >
                                        Upload Item Image
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    {imagePreview && (
                                        <Box
                                            component="img"
                                            src={imagePreview}
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 1,
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedFile ? selectedFile.name : "No file chosen"}
                                    </Typography>
                                </Box>

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Rating (0-5)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.rating}
                                    name="rating"
                                    error={!!touched.rating && !!errors.rating}
                                    helperText={touched.rating && errors.rating}
                                    sx={{ gridColumn: "span 1" }}
                                />
                                <Box sx={{ gridColumn: "span 4" }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.hasOffer}
                                                onChange={handleChange}
                                                name="hasOffer"
                                            />
                                        }
                                        label="Item has Offer"
                                    />
                                </Box>
                                {values.hasOffer && (
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        label="Offer Description (e.g. 20% OFF)"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.promo}
                                        name="promo"
                                        error={!!touched.promo && !!errors.promo}
                                        helperText={touched.promo && errors.promo}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                )}
                            </Box>
                            <Box
                                sx={{
                                    marginTop: "30px",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        background:
                                            theme.palette.mode === "dark"
                                                ? colors.greenAccent[700]
                                                : colors.greenAccent[300],
                                        padding: "10px 40px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Create Item
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default AddItem;
