import { useTheme } from "@emotion/react";
import { DataGrid } from "@mui/x-data-grid";
import { GetColors } from "../../utils/Theme";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import Header from "../../Components/Header";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

export default function RestaurantOwners() {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = GetColors(theme.palette.mode);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwners = async () => {
    try {
      const res = await api.get("/api/auth/users?role=REST_OWNER");
      setOwners(res.data);
    } catch (err) {
      console.error("Failed to fetch owners", err);
      toast.error("Failed to load restaurant owners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this owner?")) {
      try {
        await api.delete(`/api/auth/users/${id}`); // Assuming a delete endpoint exists or should exist
        toast.success("Owner removed");
        fetchOwners();
      } catch (err) {
        toast.error("Failed to delete owner");
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    {
      field: "created_at",
      headerName: "Joined Date",
      flex: 1,
      valueGetter: (params) => new Date(params).toLocaleDateString(),
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

  const ThemeCss = () => {
    let themeData = {
      mt: 3,
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: colors.blueAccent[700],
        borderBottom: "none",
      },
      "& .MuiDataGrid-footerContainer": {
        borderTop: "none",
        backgroundColor: colors.blueAccent[700],
      },
      "& .name-column--cell": {
        color: colors.greenAccent[300],
      },
    };
    return themeData;
  };

  return (
    <Box m="20px">
      <Header title="RESTAURANT OWNERS" subtitle="Manage your restaurant owner accounts" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
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
