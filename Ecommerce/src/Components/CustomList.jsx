import { Box, Typography, useTheme, Paper, alpha } from "@mui/material";
import { GetColors } from "../utils/Theme";

export default function Transactions({ data, title, emptyError }) {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);

  // Determine a neutral hover color based on the theme mode
  const hoverBg =
    theme.palette.mode === "dark"
      ? alpha("#ffffff", 0.03)
      : alpha("#000000", 0.02);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px", // Softer corners
        background:
          theme.palette.mode === "dark" ? colors.primary[400] : "#ffffff",
        border: `1px solid ${alpha(colors.primary[500], 0.15)}`,
        overflow: "hidden",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 8px 24px rgba(0,0,0,0.4)"
            : "0px 8px 24px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: "24px 20px 16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="800"
          letterSpacing="-0.5px"
          color={colors.Font[100]}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: colors.greenAccent[500],
            fontWeight: "600",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          View All
        </Typography>
      </Box>

      {/* Transactions List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          // Modern thin scrollbar
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(colors.primary[500], 0.2),
            borderRadius: "10px",
          },
        }}
      >
        {data && data.length > 0 ? (
          data.map((transaction, index) => (
            <Box
              key={`${transaction.txId}-${index}`}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: "16px 20px",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s ease-in-out",
                borderBottom: `1px solid ${alpha(colors.primary[500], 0.1)}`,
                "&:hover": {
                  backgroundColor: hoverBg,
                  // Adds a subtle green indicator on the left
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "15%",
                    height: "70%",
                    width: "4px",
                    backgroundColor: colors.greenAccent[500],
                    borderRadius: "0 4px 4px 0",
                  },
                },
              }}
            >
              {/* User Details */}
              <Box sx={{ flex: 1.5 }}>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{ color: colors.Font[100], mb: "2px" }}
                >
                  {transaction.user || "Unknown User"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: colors.Font[400], fontFamily: "monospace" }}
                >
                  #{transaction.txId?.slice(0, 8) || "000000"}
                </Typography>
              </Box>

              {/* Date Info */}
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ color: colors.Font[300], fontSize: "0.8rem" }}
                >
                  {transaction.date}
                </Typography>
              </Box>

              {/* Amount Label */}
              <Box
                sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
              >
                <Box
                  sx={{
                    backgroundColor: alpha(colors.greenAccent[500], 0.1),
                    color: colors.greenAccent[500],
                    p: "6px 12px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    border: `1px solid ${alpha(colors.greenAccent[500], 0.2)}`,
                    minWidth: "75px",
                    textAlign: "center",
                  }}
                >
                  ₹{transaction.cost}
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: "center", color: colors.Font[400] }}>
            {emptyError}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
