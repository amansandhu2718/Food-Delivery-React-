import { Box, useTheme } from "@mui/material";
import { GetColors } from "../utils/Theme";

export default function ProgressCircle({ progress = 0.75, size = 40 }) {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);

  const angle = Math.min(Math.max(progress / 100, 0), 1) * 360;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `
          radial-gradient(
            ${colors.primary[400]} 55%,
            transparent 56%
          ),
          conic-gradient(
            ${colors.greenAccent[500]} ${angle}deg,
            ${colors.primary[400]} 0deg
          )
        `,
      }}
    />
  );
}
