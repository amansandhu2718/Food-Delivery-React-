import { Box, useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";

export default function LineChart({
  data,
  bgColor,
  fontColor,
  isDashboard = false,
}) {
  const theme = useTheme();

  if (
    !Array.isArray(data) ||
    data.length === 0 ||
    data.some((serie) => !Array.isArray(serie.data))
  ) {
    return null;
  }

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.primary.light,
    theme.palette.secondary.light,
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <ResponsiveLine
        data={data}
        colors={colors}
        theme={{
          grid: {
            line: {
              stroke: theme.palette.divider,
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
          tooltip: {
            container: {
              color: theme.palette.mode === "dark" ? "#ffffff" : "#171717",
              background: theme.palette.background.paper,
            },
          },
        }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        curve="catmullRom"
        axisBottom={{
          legend: isDashboard ? undefined : "Food",
          legendOffset: 36,
        }}
        axisLeft={{
          legend: isDashboard ? undefined : "count",
          legendOffset: -40,
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "seriesColor" }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 22,
            symbolShape: "circle",
          },
        ]}
      />
    </Box>
  );
}
