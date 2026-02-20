import { Box, useTheme } from "@mui/material";
import Header from "../../Components/Header";
import { GetColors } from "../../utils/Theme";
import { mockLineData } from "../../Data/mockData";
import LineChart from "../../Components/LineChar";
export default function LineChartPage() {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  return (
    <>
      <Box
        sx={{
          m: 3,
          //   width: "100%",
        }}
      >
        <Header title="LINE CHART" subtitle="CHART " />
        <Box
          sx={{
            width: "100%",
            height: "75vh",
          }}
        >
          <LineChart
            bgColor={colors.Font[300]}
            fontColor={colors.Font[100]}
            data={mockLineData}
          />
        </Box>
      </Box>
    </>
  );
}
