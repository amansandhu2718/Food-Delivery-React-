import { Box, IconButton, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { GetColors } from "../../utils/Theme";
import Header from "../../Components/Header";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ManageRestaurants = () => {
    const theme = useTheme();
    const colors = GetColors(theme.palette.mode);
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    const fetchRestaurants = async () => {
        try {
            const res = await api.get("/api/restaurants");
            setRestaurants(res.data);
        } catch (error) {
            console.error("Failed to fetch restaurants", error);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this restaurant?")) {
            try {
                await api.delete(`/api/restaurants/${id}`);
                toast.success("Restaurant deleted");
                fetchRestaurants();
            } catch (error) {
                toast.error("Failed to delete restaurant");
            }
        }
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "location", headerName: "Location", flex: 1 },
        { field: "contact", headerName: "Contact", flex: 0.5 },
        { field: "rating", headerName: "Rating", flex: 0.3 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.5,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        onClick={() => navigate(`/admin/edit-restaurant/${params.row.id}`)}
                        color="secondary"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(params.row.id)}
                        color="error"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const themeData = {
        mt: 3,
        border: "none",
        "& .MuiDataGrid-root": {
            border: "none",
        },
        "& .MuiDataGrid-cell": {
            borderBottom: "1px solid " + theme.palette.divider,
            color: "text.primary",
            fontWeight: 500,
        },
        "& .MuiDataGrid-columnHeader": {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
            borderBottom: "2px solid " + theme.palette.primary.main,
            color: "text.primary",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
        },
        "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "transparent",
        },
        "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid " + theme.palette.divider,
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
        },
        "& .MuiCheckbox-root": {
            color: theme.palette.primary.main + " !important",
        },
        "& .MuiDataGrid-row:hover": {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(1, 128, 41, 0.04)",
        },
        "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(1, 128, 41, 0.2)" : "rgba(1, 128, 41, 0.08)",
            "&:hover": {
                backgroundColor: theme.palette.mode === "dark" ? "rgba(1, 128, 41, 0.3)" : "rgba(1, 128, 41, 0.12)",
            }
        },
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="RESTAURANTS" subtitle="List of all restaurants in the system" />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/admin/add-restaurant")}
                    sx={{ fontWeight: "bold" }}
                >
                    Add New Restaurant
                </Button>
            </Box>
            <Box height="75vh" sx={themeData}>
                <DataGrid rows={restaurants} columns={columns} />
            </Box>
        </Box>
    );
};

export default ManageRestaurants;
