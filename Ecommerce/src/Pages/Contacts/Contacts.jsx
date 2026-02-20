import { useTheme } from "@emotion/react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { GetColors } from "../../utils/Theme";
import { mockDataContacts } from "../../Data/mockData";
import { Box, Typography } from "@mui/material";
import Header from "../../Components/Header";

export default function Contacts() {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 80,
    },
    {
      field: "registrarId",
      headerName: "Registrar Id",
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
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
      minWidth: 80,
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
      field: "address",
      headerName: "Address",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "city",
      headerName: "City",

      minWidth: 150,
    },
    {
      field: "zipCode",
      headerName: "Zip Code",

      minWidth: 150,
    },
  ];

  const ThemeCss = () => {
    let themeData = {
      mt: 3,
      "& .MuiDataGrid-toolbar": {
        backgroundColor: "#141414ff !important",
        color: "#ffffff !important",
      },
      "& .MuiDataGrid-footerContainer": {
        backgroundColor: "#141414ff !important",
        color: "#ffffff !important",
      },
      "& .MuiDataGrid-columnHeader": {
        backgroundColor: "#141414ff",
        color: "#ffffff !important",
      },

      "& .name-column--cell": {
        color: colors.blueAccent[600],
      },
      "& .MuiButtonBase-root.MuiCheckbox-root.Mui-checked": {
        color: colors.greenAccent[300] + " !important",
      },
    };

    if (theme.palette.mode == "light") {
      themeData = {
        mt: 3,
        // color: colors.grey[100],

        // "--DataGrid-t-header-background-base":
        //   colors.primary[400] + " !important",
        // "--DataGrid-t-color-background-base": colors.grey[100] + " !important",
        "& .MuiTablePagination-root": {
          // border: "1px solid black",
          color: "#ffffff !important",
        },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: colors.primary[400] + " !important",
          color: "#ffffff !important",
        },
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: colors.primary[400] + " !important",
          color: "#ffffff !important",
        },
        "& .Mui-disabled": {
          color: "#ffffff",
        },
        "& .MuiDataGrid-sortButton": {
          color: "#ffffff",
          backgroundColor: colors.primary[400] + " !important",
        },
        "& .MuiTablePagination-selectIcon": {
          color: "#ffffff !important",
        },

        "& .MuiDataGrid-row": {
          backgroundColor: colors.grey[800] + " !important",
          border: "1px solid " + colors.grey[200],
        },
        "& .MuiDataGrid-toolbar": {
          backgroundColor: colors.primary[400] + " !important",
          color: "#ffffff !important",
        },
        "& .MuiButtonBase-root": {
          color: "#ffffff !important",
          //   backgroundColor: colors.primary[400] + " !important",
        },

        "& .MuiDataGrid-filler": {
          backgroundColor: colors.primary[400] + " !important",
        },
        "& .MuiButtonBase-root.MuiCheckbox-root": {
          color: "#8f8f8fff !important",
        },
        "& .MuiButtonBase-root.MuiCheckbox-root.Mui-checked": {
          color: colors.greenAccent[300] + " !important",
        },

        "& .Mui-selected": {
          border: "none",
        },
      };
    }
    return themeData;
  };

  return (
    <>
      <Box
        sx={{
          m: 3,
          //   width: "100%",
        }}
      >
        <Header title="CONTACTS" subtitle="List of Contacts " />
        <Box
          sx={{
            height: "67vh",
          }}
        >
          <DataGrid
            sx={ThemeCss()}
            rows={mockDataContacts}
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
