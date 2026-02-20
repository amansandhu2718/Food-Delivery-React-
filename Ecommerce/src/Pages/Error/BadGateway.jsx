import { Alert, Box, Divider, Typography } from "@mui/material";

export default function BadGateway() {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          //   background: "red",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 5,
        }}
      >
        <Typography variant="h1" fontWeight={800}>
          ERROR 404
        </Typography>

        <Typography variant="h4" fontWeight={800}>
          NOT FOUND
        </Typography>
        <Box
          component="img"
          src="/under_Construction.svg"
          alt="Company logo"
          sx={{
            width: "100%",
            margin: "90px",
            height: "auto",
            maxWidth: "1000px",
          }}
        />
      </Box>
    </>
  );
}
