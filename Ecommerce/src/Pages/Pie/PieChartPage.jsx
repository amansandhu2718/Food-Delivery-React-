import { Box, useTheme } from "@mui/material";
import Header from "../../Components/Header";
import { GetColors } from "../../utils/Theme";
import PieChart from "../../Components/PieChart";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { getAccessToken } from "../../utils/authService";

export default function PieChartPage() {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const [pieData, setPieData] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    socketRef.current = io("http://localhost:5001", {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current.on("dashboard:stats", (data) => {
      console.log("Pie chart data received:", data.pieData);
      setPieData(data.pieData || []);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <Box sx={{ m: 3 }}>
        <Header title="PIE CHART" subtitle="Top 10 Selling Items" />
        <Box
          sx={{
            width: "100%",
            height: "75vh",
          }}
        >
          <PieChart
            fontColor={colors.Font[100]}
            bgColor={colors.Font[300]}
            data={pieData}
          />
        </Box>
      </Box>
    </>
  );
}
