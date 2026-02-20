import { Box, useTheme } from "@mui/material";
import { GetColors } from "../utils/Theme";
import { ResponsivePie } from "@nivo/pie";

export default function PieChart({
  data,
  fontColor = "#ff0000",
  bgColor = "#0000ff",
  isDashboard = false,
}) {
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
              color: bgColor,
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
        colors={{ scheme: "set2" }}
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
