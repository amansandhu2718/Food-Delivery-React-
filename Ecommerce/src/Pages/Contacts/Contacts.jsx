import { useTheme } from "@emotion/react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { GetColors } from "../../utils/Theme";
import { Box, Typography, Button, IconButton, Tooltip } from "@mui/material";
import Header from "../../Components/Header";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function Contacts() {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/auth/users?role=USER");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (id, currentStatus) => {
    try {
      await api.put(`/api/auth/users/${id}/toggle-block`, { is_blocked: !currentStatus });
      toast.success(currentStatus ? "User unblocked" : "User blocked");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
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
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.greenAccent[600]}
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "blocked",
      headerName: "Status",
      renderCell: ({ row: { is_blocked } }) => (
        <Typography color={is_blocked ? "error" : "success"}>
          {is_blocked ? "Blocked" : "Active"}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box>
          <Tooltip title={params.row.is_blocked ? "Unblock" : "Block"}>
            <IconButton
              onClick={() => handleToggleBlock(params.row.id, params.row.is_blocked)}
              color={params.row.is_blocked ? "success" : "error"}
            >
              {params.row.is_blocked ? <CheckCircleIcon /> : <BlockIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const themeData = {
    mt: 3,
    "& .MuiDataGrid-root": { border: "none" },
    "& .MuiDataGrid-cell": { borderBottom: "1px solid " + theme.palette.divider },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
      borderBottom: "2px solid " + theme.palette.primary.main,
    },
    "& .MuiDataGrid-virtualScroller": { backgroundColor: "transparent" },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "1px solid " + theme.palette.divider,
      backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
    },
    "& .name-column--cell": { color: colors.greenAccent[300], fontWeight: 800 },
  };

  return (
    <Box m="20px">
      <Header title="CUSTOMERS" subtitle="Manage registered customers and blocking status" />
      <Box m="40px 0 0 0" height="75vh" sx={themeData}>
        <DataGrid
          loading={loading}
          rows={users}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
}
