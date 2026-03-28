// import { Box, Button, TextField, useMediaQuery, useTheme } from "@mui/material";
// import Header from "../../Components/Header";
// import { Formik } from "formik";
// import * as yup from "yup";
// import { GetColors } from "../../utils/Theme";
// import { toast, Bounce } from "react-toastify";
// import { setAccessToken } from "../../utils/authService";

// import { useNavigate, Link } from "react-router-dom";
// import { Typography } from "@mui/material";
// import { useDispatch } from "react-redux";
// import { loginUser } from "../../utils/api";
// import { loginSuccess } from "./../../redux/Slices/authSlice";
// export default function Login() {
//   const navigate = useNavigate(); // top-level, correct
//   const dispatch = useDispatch();
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

//   const HandleSubmitForm = async (values, { setSubmitting }) => {
//     try {
//       const data = await loginUser(values);

//       const { user, accessToken } = data;

//       setAccessToken(accessToken);
//       if (accessToken) {
//         localStorage.setItem("accessToken", accessToken);
//       }

//       dispatch(
//         loginSuccess({
//           user,
//           accessToken,
//         }),
//       );

//       notify(`Welcome ${user.name}`);

//       const role = user?.role?.toUpperCase();
//       if (role === "ADMIN" || role === "SUPER_ADMIN" || role === "REST_OWNER") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/browse");
//       }
//     } catch (e) {
//       notify(e.response?.data?.message || "Login failed", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // const HandleSubmitForm = async (values) => {
//   //   try {
//   //     const res = await api.post("/api/auth/login", { ...values });
//   //     console.log(res.data.user);
//   //     // store access token for API calls
//   //     if (res.data?.accessToken) {
//   //       setAccessToken(res.data.accessToken);
//   //     }
//   //      dispatch (SetLoginInfo(res.data.user)); // store user info in custom hook
//   //     notify(`Welcome ${res.data.user.name}`);
//   //     navigate("/browse"); // redirect after login
//   //   } catch (e) {
//   //     // display backend error message if available
//   //     notify(
//   //       e.response?.data?.message ||
//   //         "Login failed. Please check your credentials",
//   //       "error",
//   //     );
//   //   }
//   // };

//   const initialValues = {
//     email: "",
//     password: "",
//   };

//   const userSchema = yup.object().shape({
//     email: yup.string().email("Email is not valid").required("required"),
//     password: yup.string().required("required"),
//   });

//   return (
//     <Box sx={{ padding: 3, width: "100%" }}>
//       <Header title="LOGIN" subtitle="Sign in to your account" />
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
//                   gap: "30px",
//                   gridTemplateColumns: "repeat(4,minmax(0,1fr))",
//                   "& > div": {
//                     gridColumn: isMobile ? "span 4" : undefined,
//                   },
//                 }}
//               >
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
//                   autoComplete="current-password"
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
//                   Login
//                 </Button>
//               </Box>
//               <Box sx={{ marginTop: 2, textAlign: "center" }}>
//                 <Typography variant="body2">
//                   Don't have an account? <Link to="/register">Register</Link>
//                 </Typography>
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
  RestaurantMenuOutlined,
} from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import { GetColors } from "../../utils/Theme";
import { toast, Bounce } from "react-toastify";
import { setAccessToken } from "../../utils/authService";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../utils/api";
import { loginSuccess } from "./../../redux/Slices/authSlice";

// --- CUSTOM STYLED TEXTFIELD TO FIX AUTOFILL ICON ISSUE ---
const FoodTextField = styled(TextField)(({ theme, colors }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(0,0,0,0.2)"
        : "rgba(255,255,255,0.8)",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: colors.greenAccent[500],
    },
    "&.Mui-focused fieldset": {
      borderColor: colors.greenAccent[500],
    },
  },
  // THE FIX: Target Chrome/Safari Autofill
  "& input:-webkit-autofill": {
    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.mode === "dark" ? "#222" : "#fff"} inset !important`,
    WebkitTextFillColor: `${theme.palette.text.primary} !important`,
    transition: "background-color 5000s ease-in-out 0s",
    borderRadius: "inherit",
  },
  // Ensure icons stay on top of the autofill layer
  "& .MuiInputAdornment-root": {
    position: "relative",
    zIndex: 5,
  },
}));

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colors = GetColors(theme.palette.mode);
  const [showPassword, setShowPassword] = useState(false);

  // Background Image: Fresh ingredients for a food app vibe
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
      const data = await loginUser(values);
      const { user, accessToken } = data;
      setAccessToken(accessToken);
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      dispatch(loginSuccess({ user, accessToken }));
      notify(`Welcome back, ${user.name}`);

      const role = user?.role?.toUpperCase();
      navigate(
        ["ADMIN", "SUPER_ADMIN", "REST_OWNER"].includes(role)
          ? "/admin/dashboard"
          : "/browse",
      );
    } catch (e) {
      notify(e.response?.data?.message || "Login failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

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
            p: isMobile ? 4 : 6,
            width: "100%",
            maxWidth: "460px",
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
          {/* Brand Header */}
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                display: "inline-flex",
                backgroundColor: colors.greenAccent[500],
                p: 1.8,
                borderRadius: "20px",
                mb: 2,
                boxShadow: `0 10px 20px ${colors.greenAccent[500]}44`,
              }}
            >
              <RestaurantMenuOutlined sx={{ color: "#fff", fontSize: 32 }} />
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
              Login
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
              Premium food delivery at your doorstep
            </Typography>
          </Box>

          <Formik
            onSubmit={HandleSubmitForm}
            initialValues={{ email: "", password: "" }}
            validationSchema={yup.object().shape({
              email: yup
                .string()
                .email("Enter a valid email")
                .required("Email is required"),
              password: yup.string().required("Password is required"),
            })}
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
                <Box display="flex" flexDirection="column" gap={3}>
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined
                            sx={{ color: colors.greenAccent[500] }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    sx={{
                      py: 1.8,
                      fontSize: "1rem",
                      fontWeight: "700",
                      textTransform: "none",
                      borderRadius: "16px",
                      backgroundColor: colors.greenAccent[500],
                      "&:hover": {
                        backgroundColor: colors.greenAccent[600],
                        transform: "scale(1.02)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isSubmitting ? "Signing you in..." : "Login to Eat"}
                  </Button>

                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Hungry for an account?{" "}
                      <Link
                        to="/register"
                        style={{
                          color: colors.greenAccent[500],
                          textDecoration: "none",
                          fontWeight: "800",
                        }}
                      >
                        Join Now
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
