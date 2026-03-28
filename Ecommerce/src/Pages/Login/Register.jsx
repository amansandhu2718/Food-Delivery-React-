// import {
//   Box,
//   Button,
//   TextField,
//   useMediaQuery,
//   useTheme,
//   Typography,
// } from "@mui/material";
// import Header from "../../Components/Header";
// import { Formik } from "formik";
// import * as yup from "yup";
// import { GetColors } from "../../utils/Theme";
// import { toast, Bounce } from "react-toastify";
// import api from "../../utils/api";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const colors = GetColors(theme.palette.mode);

//   const notify = (msg, type = "success") =>
//     toast[type](msg, {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: false,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: theme.palette.mode === "dark" ? "dark" : "colored",
//       transition: Bounce,
//     });

//   const HandleSubmitForm = async (values) => {
//     try {
//       const res = await api.post("/api/auth/register", { ...values });
//       notify(res.data?.message || "Registered successfully");
//       // redirect to verify email - pass email so OTP page can prefill
//       // if backend returned otp (dev mode), forward it so user can verify immediately
//       navigate("/verify-email", {
//         state: { email: values.email, otp: res.data?.otp },
//       });
//     } catch (e) {
//       notify(e.response?.data?.message || "Registration failed", "error");
//     }
//   };

//   const initialValues = {
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   };

//   const userSchema = yup.object().shape({
//     name: yup.string().required("required"),
//     email: yup.string().email("Email is not valid").required("required"),
//     password: yup.string().min(6, "Minimum 6 characters").required("required"),
//     confirmPassword: yup
//       .string()
//       .oneOf([yup.ref("password"), null], "Passwords must match")
//       .required("required"),
//   });

//   return (
//     <Box sx={{ padding: 3, width: "100%" }}>
//       <Header title="REGISTER" subtitle="Create an account" />
//       <Box
//         sx={{
//           width: "100%",
//           marginTop: "30px",
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <Formik
//           onSubmit={HandleSubmitForm}
//           initialValues={initialValues}
//           validationSchema={userSchema}
//         >
//           {({
//             values,
//             errors,
//             touched,
//             handleBlur,
//             handleChange,
//             handleSubmit,
//           }) => (
//             <form
//               onSubmit={handleSubmit}
//               style={{ width: isMobile ? "100%" : "50%" }}
//             >
//               <Box
//                 sx={{
//                   display: "grid",
//                   gap: "20px",
//                   gridTemplateColumns: "repeat(4,minmax(0,1fr))",
//                   "& > div": { gridColumn: isMobile ? "span 4" : undefined },
//                 }}
//               >
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   type="text"
//                   label="Name"
//                   name="name"
//                   value={values.name}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={!!touched.name && !!errors.name}
//                   helperText={touched.name && errors.name}
//                   sx={{ gridColumn: "span 4" }}
//                 />
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   type="text"
//                   label="Email"
//                   name="email"
//                   value={values.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={!!touched.email && !!errors.email}
//                   helperText={touched.email && errors.email}
//                   sx={{ gridColumn: "span 4" }}
//                 />
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   type="password"
//                   label="Password"
//                   name="password"
//                   value={values.password}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={!!touched.password && !!errors.password}
//                   helperText={touched.password && errors.password}
//                   sx={{ gridColumn: "span 4" }}
//                 />
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   type="password"
//                   label="Confirm Password"
//                   name="confirmPassword"
//                   value={values.confirmPassword}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={!!touched.confirmPassword && !!errors.confirmPassword}
//                   helperText={touched.confirmPassword && errors.confirmPassword}
//                   sx={{ gridColumn: "span 4" }}
//                 />
//               </Box>
//               <Box
//                 sx={{
//                   marginTop: "30px",
//                   display: "flex",
//                   justifyContent: "center",
//                   width: "100%",
//                 }}
//               >
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   sx={{
//                     background:
//                       theme.palette.mode === "dark"
//                         ? colors.greenAccent[700]
//                         : colors.greenAccent[300],
//                   }}
//                 >
//                   Register
//                 </Button>
//               </Box>
//             </form>
//           )}
//         </Formik>
//       </Box>
//     </Box>
//   );
// }

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  Fade,
  styled,
} from "@mui/material";
import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  PersonOutline,
  RestaurantMenuOutlined,
} from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import { GetColors } from "../../utils/Theme";
import { toast, Bounce } from "react-toastify";
import api from "../../utils/api";
import { useNavigate, Link } from "react-router-dom";

// --- SHARED STYLED TEXTFIELD (Matches Login) ---
const FoodTextField = styled(TextField)(({ theme, colors }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(0,0,0,0.2)"
        : "rgba(255,255,255,0.8)",
    transition: "all 0.3s ease",
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: colors.greenAccent[500] },
    "&.Mui-focused fieldset": { borderColor: colors.greenAccent[500] },
  },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.mode === "dark" ? "#222" : "#fff"} inset !important`,
    WebkitTextFillColor: `${theme.palette.text.primary} !important`,
    transition: "background-color 5000s ease-in-out 0s",
    borderRadius: "inherit",
  },
  "& .MuiInputAdornment-root": { position: "relative", zIndex: 5 },
}));

export default function Register() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colors = GetColors(theme.palette.mode);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const bgImage =
    "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop";

  const notify = (msg, type = "success") =>
    toast[type](msg, {
      position: "top-right",
      autoClose: 3000,
      transition: Bounce,
      theme: theme.palette.mode,
    });

  const HandleSubmitForm = async (values, { setSubmitting }) => {
    try {
      const res = await api.post("/api/auth/register", { ...values });
      notify(res.data?.message || "Account created! Please verify.");
      navigate("/verify-email", {
        state: { email: values.email, otp: res.data?.otp },
      });
    } catch (e) {
      notify(e.response?.data?.message || "Registration failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const userSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Minimum 6 characters").required("Required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        p: 2,
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 4 : 5,
            width: "100%",
            maxWidth: "500px",
            borderRadius: "28px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(28, 28, 28, 0.85)"
                : "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.3)"}`,
          }}
        >
          <Box textAlign="center" mb={3}>
            <Box
              sx={{
                display: "inline-flex",
                backgroundColor: colors.greenAccent[500],
                p: 1.5,
                borderRadius: "18px",
                mb: 2,
                boxShadow: `0 8px 16px ${colors.greenAccent[500]}44`,
              }}
            >
              <RestaurantMenuOutlined sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight="900"
              sx={{ letterSpacing: "-1px", color: theme.palette.text.primary }}
            >
              <span
                style={{ fontSize: "55px", color: colors.greenAccent[500] }}
              >
                Cravyy
              </span>
              <span style={{ fontSize: "55px", color: colors.redAccent[500] }}>
                .
              </span>
              Register
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
              Create an account to start ordering
            </Typography>
          </Box>

          <Formik
            onSubmit={HandleSubmitForm}
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={userSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <FoodTextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    colors={colors}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline
                            sx={{ color: colors.greenAccent[500] }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FoodTextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    colors={colors}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined
                            sx={{ color: colors.greenAccent[500] }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box
                    display="flex"
                    gap={2}
                    flexDirection={isMobile ? "column" : "row"}
                  >
                    <FoodTextField
                      fullWidth
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      error={!!touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      colors={colors}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <FoodTextField
                      fullWidth
                      label="Confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.confirmPassword}
                      error={
                        !!touched.confirmPassword && !!errors.confirmPassword
                      }
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                      colors={colors}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    sx={{
                      py: 1.8,
                      mt: 1,
                      fontSize: "1rem",
                      fontWeight: "700",
                      textTransform: "none",
                      borderRadius: "16px",
                      backgroundColor: colors.greenAccent[500],
                      "&:hover": {
                        backgroundColor: colors.greenAccent[600],
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isSubmitting ? "Creating account..." : "Register Now"}
                  </Button>

                  <Box textAlign="center" mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        style={{
                          color: colors.greenAccent[500],
                          textDecoration: "none",
                          fontWeight: "800",
                        }}
                      >
                        Sign In
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </form>
            )}
          </Formik>
        </Paper>
      </Fade>
    </Box>
  );
}
