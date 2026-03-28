import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import Header from "../../Components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { GetColors } from "../../utils/Theme";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function CreateOwner() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colors = GetColors(theme.palette.mode);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "REST_OWNER",
  });

  useEffect(() => {
    if (id) {
      const fetchOwner = async () => {
        try {
          const res = await api.get(`/api/auth/users?id=${id}`);
          const owner = res.data.find(u => u.id == id);
          if (owner) {
            setInitialValues({
              name: owner.name,
              email: owner.email,
              password: "",
              phone: owner.phone || "",
              role: owner.role || "REST_OWNER",
            });
          }
        } catch (err) {
          toast.error("Failed to fetch account details");
        }
      };
      fetchOwner();
    }
  }, [id]);

  const HandleSubmitForm = async (values, { resetForm }) => {
    try {
      // If Admin is creating, they can only create REST_OWNER
      const role =
        currentUser?.role?.toUpperCase() === "SUPER_ADMIN"
          ? values.role
          : "REST_OWNER";
      
      if (id) {
        await api.put(`/api/auth/users/${id}`, {
          ...values,
          role,
        });
        toast.success("Account Updated Successfully");
      } else {
        await api.post("/api/auth/register", {
          ...values,
          role,
        });
        toast.success("Account Created Successfully");
      }
      resetForm();
      navigate("/admin/owners");
    } catch (e) {
      toast.error(e.response?.data?.message || "Operation failed");
    }
  };

  const userSchema = yup.object().shape({
    name: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().when('id', {
      is: (val) => !val, // Only required for new users
      then: (schema) => schema.min(6, "too short").required("required"),
      otherwise: (schema) => schema.min(6, "too short").optional(),
    }),
    phone: yup.string().required("required"),
    role: yup.string().required("required"),
  });

  return (
    <Box p="20px">
      <Header
        title={id ? "EDIT ACCOUNT" : "CREATE ACCOUNT"}
        subtitle={id ? "Update account details" : "Create a new Admin or Owner account"}
      />
      <Box mt="40px" display="flex" justifyContent="center">
        <Formik
          enableReinitialize
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
            <form onSubmit={handleSubmit} style={{ width: isMobile ? "100%" : "50%" }}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isMobile ? "span 4" : undefined },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  label="Full Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                
                {currentUser?.role?.toUpperCase() === "SUPER_ADMIN" && (
                  <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }} error={!!touched.role && !!errors.role}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="ADMIN">ADMIN</MenuItem>
                      <MenuItem value="REST_OWNER">RESTAURANT OWNER</MenuItem>
                    </Select>
                    {touched.role && errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                  </FormControl>
                )}

                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label={id ? "New Password (optional)" : "Password"}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Phone Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone}
                  name="phone"
                  error={!!touched.phone && !!errors.phone}
                  helperText={touched.phone && errors.phone}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt="30px">
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{ px: 4, py: 1 }}
                >
                  {id ? "Update Account" : "Create Account"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
