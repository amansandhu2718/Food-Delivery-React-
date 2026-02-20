import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Box, Typography, useTheme } from "@mui/material";
import { GetColors } from "../utils/Theme";

export default function Transactions({ data, title }) {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          //   background: "red",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid " + colors.primary[500],
            width: "100%",
            height: "50px",
            color: colors.Font[400],
            padding: "0 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight="600">{title}</Typography>
        </Box>
        {data &&
          data.map((transaction, index) => {
            return (
              <Box
                key={`${transaction.txId}-${index}`}
                sx={{
                  width: "100%",
                  color: "#ffffff",
                  padding: "15px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: `1px solid ${colors.primary[500]}`,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: colors.greenAccent[500], fontWeight: "600" }}
                  >
                    {transaction.user || "Unknown User"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.Font[400], fontSize: "0.75rem" }}
                  >
                    ID: {transaction.txId ? (transaction.txId.length > 8 ? transaction.txId.substring(0, 8) + "..." : transaction.txId) : "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ color: colors.Font[100] }}>
                  {transaction.date}
                </Box>
                <Box
                  sx={{
                    backgroundColor: colors.greenAccent[500],
                    padding: "5px 10px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    minWidth: "80px",
                    textAlign: "center"
                  }}
                >
                  ₹{transaction.cost}
                </Box>
              </Box>
            );
          })}
      </Box>
    </>
  );
}
