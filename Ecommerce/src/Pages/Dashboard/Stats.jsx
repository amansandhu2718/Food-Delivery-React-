import { Box, Typography, useTheme } from "@mui/material";
import { GetColors } from "../../utils/Theme";
import ProgressCircle from "../../Components/ProgressCircle";

export default function Stats({ title, subtitle, icon, progress, increase }) {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
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
              variant="h4"
              fontWeight="bold"
              sx={{
                color: colors.Font[400],
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
            variant="h6"
            sx={{
              color: colors.greenAccent[400],
            }}
          >
            {subtitle}
          </Typography>
          <Typography
            variant="h4"
            fontStyle="italic"
            sx={{
              color: colors.Font[400],
            }}
          >
            {increase}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
