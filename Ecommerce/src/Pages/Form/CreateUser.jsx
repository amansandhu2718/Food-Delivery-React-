import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Header from "../../Components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { GetColors } from "../../utils/Theme";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CreateOwner() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colors = GetColors(theme.palette.mode);

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  useEffect(() => {
    if (id) {
      const fetchOwner = async () => {
        try {
          const res = await api.get(`/api/auth/users?id=${id}`); // Assuming we can filter by ID
          const owner = res.data.find(u => u.id == id);
          if (owner) {
            setInitialValues({
              name: owner.name,
              email: owner.email,
              password: "", // Don't show password
              phone: owner.phone || "",
            });
          }
        } catch (err) {
          toast.error("Failed to fetch owner details");
        }
      };
      fetchOwner();
    }
  }, [id]);

  const HandleSubmitForm = async (values, { resetForm }) => {
    try {
      if (id) {
        await api.put(`/api/auth/users/${id}`, {
          ...values,
          role: "REST_OWNER",
        });
        toast.success("Owner Updated Successfully");
      } else {
        await api.post("/api/auth/register", {
          ...values,
          role: "REST_OWNER",
        });
        toast.success("Restaurant Owner Created Successfully");
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
    password: yup.string().min(6, "too short").required("required"),
    phone: yup.string().required("required"),
  });

  return (
    <Box p="20px">
      <Header
        title={id ? "EDIT OWNER" : "CREATE OWNER"}
        subtitle={id ? "Update restaurant owner details" : "Create a new Restaurant Owner account"}
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
                  {id ? "Update Owner" : "Create Owner"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
