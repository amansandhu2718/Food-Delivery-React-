import { ResponsiveBar } from "@nivo/bar";
import { Box, useTheme } from "@mui/material";

export default function BarChart({
  data,
  fontColor,
  bgColor,
  isDashboard = false,
}) {
  const theme = useTheme();
  
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.primary.light,
    "#064e3b", // Emerald 900
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <ResponsiveBar
        colors={colors}
        keys={["burger", "kebab", "donut"]} // REQUIRED
        theme={{
          tooltip: {
            container: {
              color: theme.palette.mode === "dark" ? "#ffffff" : "#171717",
              background: theme.palette.background.paper,
            },
          },
          grid: {
            line: {
              stroke: fontColor || theme.palette.divider,
              strokeWidth: 1,
            },
          },
          axis: {
            domain: {
              line: {
                stroke: fontColor || theme.palette.text.secondary,
              },
            },
            legend: {
              text: {
                fill: fontColor || theme.palette.text.secondary,
              },
            },
            ticks: {
              line: {
                stroke: fontColor || theme.palette.text.secondary,
              },
              text: {
                fill: fontColor || theme.palette.text.secondary,
              },
            },
          },
          legends: {
            text: {
              fill: fontColor || theme.palette.text.secondary,
            },
          },
        }}
        layout="vertical"
        data={data}
        indexBy="country"
        labelSkipWidth={12}
        labelSkipHeight={12}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 120,
            itemsSpacing: 3,
            itemWidth: 100,
            itemHeight: 16,
          },
        ]}
        axisBottom={{
          legend: isDashboard ? undefined : "country",
          legendOffset: 32,
        }}
        axisLeft={{
          legend: isDashboard ? undefined : "food",
          legendOffset: -40,
        }}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      />
    </Box>
  );
}
