import { Box, useTheme } from "@mui/material";
import { GetColors } from "../utils/Theme";
import { ResponsivePie } from "@nivo/pie";

export default function PieChart({
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
    theme.palette.secondary.light,
    "#064e3b", // Emerald 900
  ];
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <ResponsivePie /* or Pie for fixed dimensions */
        theme={{
          tooltip: {
            container: {
              color: theme.palette.mode === "dark" ? "#ffffff" : "#171717",
              background: theme.palette.background.paper,
            },
          },
          axis: {
            domain: {
              line: {
                stroke: fontColor,
              },
            },
            legend: {
              text: {
                fill: fontColor,
              },
            },
            ticks: {
              line: {
                stroke: fontColor,
              },
              text: {
                fill: fontColor,
              },
            },
          },
          legends: {
            text: {
              fill: fontColor,
              fontSize: 12,
            },
          },
        }}
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.6}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        colors={colors}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={fontColor}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        motionConfig="wobbly"
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            symbolShape: "circle",
          },
        ]}
      />
    </Box>
  );
}
