import { useTheme } from "@emotion/react";
import { DataGrid } from "@mui/x-data-grid";
import { GetColors } from "../../utils/Theme";
import { Box, Typography, IconButton, Tooltip, Button } from "@mui/material";
import Header from "../../Components/Header";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RestaurantOwners() {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = GetColors(theme.palette.mode);
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwners = async () => {
    try {
      // SuperAdmin can see ADMIN and REST_OWNER. 
      // For now, simplicity: if SuperAdmin, fetch all non-users? 
      // Or just stick to REST_OWNER but add ADMIN for SuperAdmin view.
      const roleFilter = currentUser?.role === "SUPER_ADMIN" ? "" : "role=REST_OWNER";
      const res = await api.get(`/api/auth/users?${roleFilter}`);
      
      // Filter out SuperAdmins and self from display
      setOwners(res.data.filter(u => u.role !== "SUPER_ADMIN" && u.id !== currentUser.id && u.role !== "USER"));
    } catch (err) {
      console.error("Failed to fetch owners", err);
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [currentUser?.role]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this account?")) {
      try {
        await api.delete(`/api/auth/users/${id}`);
        toast.success("Account removed");
        fetchOwners();
      } catch (err) {
        toast.error("Failed to delete account");
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: ({ row: { role } }) => (
        <Typography color={role === "ADMIN" ? "secondary" : "primary"}>
          {role}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => navigate(`/admin/edit-owner/${params.row.id}`)}
              color="secondary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id)} sx={{ color: colors.redAccent[500] }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="ADMINISTRATION" subtitle="Manage Admins and Restaurant Owners" />
        {currentUser?.role === "SUPER_ADMIN" && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/create-owner")}
          >
            Create New Admin/Owner
          </Button>
        )}
      </Box>
      
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "1px solid " + theme.palette.divider },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
            borderBottom: "2px solid " + theme.palette.primary.main,
          },
          "& .name-column--cell": { color: colors.greenAccent[300], fontWeight: 800 },
        }}
      >
        <DataGrid
          loading={loading}
          rows={owners}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
}
