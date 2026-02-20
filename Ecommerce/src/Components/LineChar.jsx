import { Box } from "@mui/material";
import { GetColors } from "../utils/Theme";
import { ResponsiveLine } from "@nivo/line";

export default function LineChart({
  data,
  bgColor = "#ff0000",
  fontColor = "#0000ff",
  isDashboard = false,
}) {
  if (
    !Array.isArray(data) ||
    data.length === 0 ||
    data.some((serie) => !Array.isArray(serie.data))
  ) {
    console.log(data);
    return null;
  }
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        // background: "red",
      }}
    >
      <ResponsiveLine /* or Line for fixed dimensions */
        data={data}
        colors={{ scheme: "set1" }}
        theme={{
          grid: {
            line: {
              stroke: fontColor, // 👈 grid line color
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
          tooltip: {
            container: {
              color: bgColor,
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
        axisBottom={{ legend: "transportation", legendOffset: 36 }}
        axisLeft={{ legend: "count", legendOffset: -40 }}
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
