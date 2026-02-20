import { Box, Typography, useTheme } from "@mui/material";
import { GetColors } from "../utils/Theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);

  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h2" color={colors.Font[100]} fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="h4" color={colors.blueAccent[300]}>
          {subtitle}
        </Typography>
      </Box>
    </>
  );
};

export default Header;
