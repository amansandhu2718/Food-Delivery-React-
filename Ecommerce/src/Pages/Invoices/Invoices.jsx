import { useTheme } from "@emotion/react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { GetColors } from "../../utils/Theme";
import { mockDataInvoices } from "../../Data/mockData";
import { Box, Typography } from "@mui/material";
import Header from "../../Components/Header";

export default function Invoices() {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 80,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 150,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                color: "" + colors.greenAccent[600] + " !important",
              }}
            >
              Rs. {params.row.cost}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 150,
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
    "& .MuiDataGrid-toolbarContainer": {
      padding: "12px",
      backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
      "& .MuiButton-root": {
        color: "primary.main",
        fontWeight: 800,
      },
    },
    "& .MuiCheckbox-root": {
      color: theme.palette.primary.main + " !important",
    },
    "& .name-column--cell": {
      color: "secondary.main",
      fontWeight: 800,
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
    <>
      <Box
        sx={{
          m: 3,
          //   width: "100%",
        }}
      >
        <Header title="INVOICES" subtitle="Records of Invoices " />
        <Box
          sx={{
            height: "67vh",
          }}
        >
          <DataGrid
            sx={themeData}
            rows={mockDataInvoices}
            columns={columns}
            showToolbar
            // isRowSelectable={true}
            checkboxSelection
            pagination
            pageSizeOptions={[3, 5, 10]}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 10,
                },
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
}
