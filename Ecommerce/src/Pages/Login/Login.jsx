import { Box, Button, TextField, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../Components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { GetColors } from "../../utils/Theme";
import { toast, Bounce } from "react-toastify";
import api from "../../utils/api";
import { setAccessToken } from "../../utils/authService";
import { useLoginInfo } from "../../utils/CustomHooks";
import { useNavigate, Link } from "react-router-dom";
import { Typography } from "@mui/material";

export default function Login() {
  const navigate = useNavigate(); // top-level, correct

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colors = GetColors(theme.palette.mode);
  const [logininfo, SetLoginInfo] = useLoginInfo();

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
      const res = await api.post("/api/auth/login", { ...values });
      console.log(res.data.user);
      // store access token for API calls
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
      }
      SetLoginInfo(res.data.user); // store user info in custom hook
      notify(`Welcome ${res.data.user.name}`);
      navigate("/browse"); // redirect after login
    } catch (e) {
      // display backend error message if available
      notify(
        e.response?.data?.message ||
          "Login failed. Please check your credentials",
        "error"
      );
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const userSchema = yup.object().shape({
    email: yup.string().email("Email is not valid").required("required"),
    password: yup.string().required("required"),
  });

  return (
    <Box sx={{ padding: 3, width: "100%" }}>
      <Header title="LOGIN" subtitle="Sign in to your account" />
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
                  gap: "30px",
                  gridTemplateColumns: "repeat(4,minmax(0,1fr))",
                  "& > div": {
                    gridColumn: isMobile ? "span 4" : undefined,
                  },
                }}
              >
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
                  autoComplete="current-password"
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
                  Login
                </Button>
              </Box>
              <Box sx={{ marginTop: 2, textAlign: "center" }}>
                <Typography variant="body2">
                  Don't have an account? <Link to="/register">Register</Link>
                </Typography>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
