import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import Header from "../../Components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { GetColors } from "../../utils/Theme";
import { toast, Bounce } from "react-toastify";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colors = GetColors(theme.palette.mode);

  const notify = (msg, type = "success") =>
    toast[type](msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme.palette.mode === "dark" ? "dark" : "colored",
      transition: Bounce,
    });

  const HandleSubmitForm = async (values) => {
    try {
      const res = await api.post("/api/auth/register", { ...values });
      notify(res.data?.message || "Registered successfully");
      // redirect to verify email - pass email so OTP page can prefill
      // if backend returned otp (dev mode), forward it so user can verify immediately
      navigate("/verify-email", {
        state: { email: values.email, otp: res.data?.otp },
      });
    } catch (e) {
      notify(e.response?.data?.message || "Registration failed", "error");
    }
  };

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const userSchema = yup.object().shape({
    name: yup.string().required("required"),
    email: yup.string().email("Email is not valid").required("required"),
    password: yup.string().min(6, "Minimum 6 characters").required("required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("required"),
  });

  return (
    <Box sx={{ padding: 3, width: "100%" }}>
      <Header title="REGISTER" subtitle="Create an account" />
      <Box
        sx={{
          width: "100%",
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Formik
          onSubmit={HandleSubmitForm}
          initialValues={initialValues}
          validationSchema={userSchema}
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
              style={{ width: isMobile ? "100%" : "50%" }}
            >
              <Box
                sx={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns: "repeat(4,minmax(0,1fr))",
                  "& > div": { gridColumn: isMobile ? "span 4" : undefined },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
              <Box
                sx={{
                  marginTop: "30px",
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background:
                      theme.palette.mode === "dark"
                        ? colors.greenAccent[700]
                        : colors.greenAccent[300],
                  }}
                >
                  Register
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
