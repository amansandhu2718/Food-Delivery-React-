import { ResponsiveBar } from "@nivo/bar";

import { Box, useTheme } from "@mui/material";
import { GetColors } from "../utils/Theme";

export default function BarChart({
  data,
  fontColor = "#ff0000",
  bgColor = "#0000ff",
  graphColorTheme = "set3", //category10,pastel2,purpleRed_green
  isDashboard = false,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <ResponsiveBar /* or Bar for fixed dimensions */
        colors={{ scheme: graphColorTheme }}
        keys={["burger", "kebab", "donut"]} // REQUIRED
        theme={{
          tooltip: {
            container: {
              color: bgColor,
            },
          },
          grid: {
            line: {
              stroke: fontColor,
              strokeWidth: 1,
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
            },
          },
        }}
        layout="vertical" // 👈 forces bottom-to-top animation
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
          legend: isDashboard ? undefined : "country (indexBy)",
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
