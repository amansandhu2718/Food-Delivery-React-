import { Box, useTheme } from "@mui/material";

export default function ProgressCircle({ progress = 0.75, size = 40 }) {
  const theme = useTheme();

  const angle = Math.min(Math.max(progress / 100, 0), 1) * 360;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `
          radial-gradient(
            ${theme.palette.background.paper} 55%,
            transparent 56%
          ),
          conic-gradient(
            ${theme.palette.primary.main} ${angle}deg,
            ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 0deg
          )
        `,
      }}
    />
  );
}
