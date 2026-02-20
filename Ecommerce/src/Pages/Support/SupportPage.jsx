import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    Paper,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../Components/Header";
import { GetColors } from "../../utils/Theme";
import api from "../../utils/api";
import { toast } from "react-toastify";

const validationSchema = yup.object().shape({
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Message is required").min(10, "Message must be at least 10 characters"),
});

const initialValues = {
    subject: "",
    message: "",
};

const SupportPage = () => {
    const theme = useTheme();
    const colors = GetColors(theme.palette.mode);

    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            await api.post("/api/complaints", values);
            toast.success("Complaint submitted successfully! We will get back to you soon.");
            resetForm();
        } catch (error) {
            console.error("Complaint submission error:", error);
            toast.error(error.response?.data?.message || "Failed to submit complaint");
        }
    };

    return (
        <Box m="20px">
            <Header title="HELP & SUPPORT" subtitle="Talk to us, we are here to help" />

            <Box display="flex" justifyContent="center" mt="40px">
                <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: "600px", backgroundColor: colors.primary[400] }}>
                    <Typography variant="h4" mb="20px" textAlign="center" color={colors.greenAccent[500]}>
                        Submit a Complaint
                    </Typography>

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
                            <form onSubmit={handleSubmit}>
                                <Box display="flex" flexDirection="column" gap="20px">
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Subject"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.subject}
                                        name="subject"
                                        error={!!touched.subject && !!errors.subject}
                                        helperText={touched.subject && errors.subject}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Message"
                                        multiline
                                        rows={6}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.message}
                                        name="message"
                                        error={!!touched.message && !!errors.message}
                                        helperText={touched.message && errors.message}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="center" mt="30px">
                                    <Button type="submit" color="secondary" variant="contained" size="large" sx={{ px: 5 }}>
                                        Submit Complaint
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Paper>
            </Box>

            <Box mt="50px">
                <Typography variant="h5" color={colors.Font[200]} mb="20px">
                    Frequently Asked Questions
                </Typography>
                <Typography variant="body1" color={colors.Font[400]}>
                    • How do I track my order? <br />
                    • Can I cancel my order? <br />
                    • What are the delivery charges?
                </Typography>
            </Box>
        </Box>
    );
};

export default SupportPage;
