import { Box, Typography, useTheme } from "@mui/material";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h2" color="text.primary" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="h4" color="primary.light">
          {subtitle}
        </Typography>
      </Box>
    </>
  );
};

export default Header;
