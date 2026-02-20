import { Box, useTheme } from "@mui/material";
import BarChart from "../../Components/BarChart";
import Header from "../../Components/Header";
import { GetColors } from "../../utils/Theme";
import { mockBarData } from "../../Data/mockData";
export default function BarChartPage() {
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
        <Header title="BAR CHART" subtitle="CHART " />
        <Box
          sx={{
            width: "100%",
            height: "75vh",
          }}
        >
          <BarChart
            fontColor={colors.Font[100]}
            bgColor={colors.Font[300]}
            data={mockBarData}
          />
        </Box>
      </Box>
    </>
  );
}
