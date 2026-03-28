import { Box, Typography, useTheme } from "@mui/material";
import ProgressCircle from "../../Components/ProgressCircle";

export default function Stats({ title, subtitle, icon, progress, increase }) {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          width: "100%",
          m: "0 30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            {icon}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "text.primary",
                mt: 1,
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box>
            <ProgressCircle progress={progress} />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "primary.main",
              fontWeight: 800,
              letterSpacing: "0.05em",
            }}
          >
            {subtitle}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "text.secondary",
              fontWeight: 700,
            }}
          >
            {increase}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
