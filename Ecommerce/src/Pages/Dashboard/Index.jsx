import {
  Box,
  Button,
  IconButton,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Header from "../../Components/Header";
import ProgressCircle from "../../Components/ProgressCircle";
import Stats from "./Stats";
import DownloadoutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import { GetColors } from "../../utils/Theme";
import LineChart from "./../../Components/LineChar";

import PieChart from "./../../Components/PieChart";
import BarChart from "../../Components/BarChart";
import Transactions from "../../Components/CustomList";
import {
  mockBarData,
  mockLineData,
  mockTransactions,
} from "../../Data/mockData";
import { mockPieData } from "../../Data/mockData";
import { useRef, useEffect, useState } from "react";
import styled from "@emotion/styled";
import html2canvas from "html2canvas";
import { io } from "socket.io-client";
import { getAccessToken } from "../../utils/authService";

const StyledBox = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  ":hover": {
    outline: "2px solid #6e6e6e28",
  },
}));

const Dashboard = () => {
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalUsers: 0,
  });
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    socketRef.current = io("http://localhost:5001", {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current.on("dashboard:stats", (data) => {
      console.log("Dashboard stats received:", data);
      setStats(data.stats);
      setLineData(data.lineData);
      setPieData(data.pieData);
      setBarData(data.barData || []);
      setRecentTransactions(data.recentTransactions);
      setRecentComplaints(data.recentComplaints || []);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const takeScreenshot = async () => {
    console.log("button clicked");
    // if (!captureRef.current) return;
    const canvas = await html2canvas(document.body);
    console.log("button clicked 1");

    // const canvas = await html2canvas(captureRef.current, {
    //   scale: window.devicePixelRatio,
    //   useCORS: true,
    // });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "screenshot.png";
    link.click();
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        {/* <CloseIcon fontSize="small" /> */}
      </IconButton>
    </>
  );

  return (
    <Box
      sx={{
        m: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard " />
        <Box>
          <Button
            sx={{
              backgroundColor: colors.primary[400],
              color: colors.Font[400],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              whiteSpace: "nowrap",
            }}
            onClick={takeScreenshot}
          >
            <DownloadoutlinedIcon
              sx={{
                mr: "10px",
              }}
            />
            Download Report
          </Button>

          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            message="Screenshot Captured"
            action={action}
          />
        </Box>
      </Box>

      {/* GRID */}
      <Box
        sx={{
          marginTop: "10px",
          display: "grid",
          gridTemplateColumns: "repeat(12,1fr)",
          gridAutoRows: "140px",
          gridGap: "12px",
        }}
      >
        {/* Row 1  */}
        <Box
          sx={{
            gridColumn: isMobile ? "span 12" : "span 3",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stats
            title={`₹${Number(stats.totalSales).toLocaleString()}`}
            subtitle="Total Sales"
            progress={75}
            increase="+12%"
            icon={
              <PointOfSaleIcon
                sx={{
                  color: colors.greenAccent[500],
                  fontSize: "26px",
                }}
              />
            }
          />
        </Box>
        <Box
          sx={{
            gridColumn: isMobile ? "span 12" : "span 3",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stats
            title={stats.totalOrders}
            subtitle="Orders Received"
            progress={55}
            increase="+5%"
            icon={
              <TrafficIcon
                sx={{
                  color: colors.greenAccent[500],
                  fontSize: "26px",
                }}
              />
            }
          />
        </Box>
        <Box
          sx={{
            gridColumn: isMobile ? "span 12" : "span 3",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stats
            title={stats.totalCustomers}
            subtitle="Total Customers"
            progress={55}
            increase="+10%"
            icon={
              <PersonAddIcon
                sx={{
                  color: colors.greenAccent[500],
                  fontSize: "26px",
                }}
              />
            }
          />
        </Box>
        <Box
          sx={{
            gridColumn: isMobile ? "span 12" : "span 3",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stats
            title={stats.totalUsers || "0"}
            subtitle="Total Registered Users"
            progress={75}
            increase="+5%"
            icon={
              <TrafficIcon
                sx={{
                  color: colors.greenAccent[500],
                  fontSize: "26px",
                }}
              />
            }
          />
        </Box>

        {/* Row 2 */}
        <Box
          sx={{
            gridColumn: isMobile ? "span 12" : "span 8",
            gridRow: "span 2",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LineChart
            backgroundColor={colors.Font[500]}
            fontColor={colors.Font[200]}
            data={lineData}
            isDashboard={true}
          />
        </Box>
        <Box
          sx={{
            gridColumn: isMobile ? "span 12" : "span 4",
            gridRow: "span 2",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Transactions data={recentTransactions} title="Recent Transactions" />
        </Box>
        {/* Row 3 */}

        <Box
          sx={{
            gridColumn: isMobile ? "span 12" : "span 4",
            gridRow: "span 2",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PieChart
            bgColor={colors.Font[300]}
            fontColor={colors.Font[400]}
            data={pieData.slice(0, 3)}
            isDashboard={true}
          />
        </Box>
        <Box
          sx={{
            gridColumn: isMobile ? "span 12" : "span 4",
            gridRow: "span 2",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Transactions data={recentComplaints} title="Complaints from users" />
        </Box>
        <StyledBox
          sx={{
            gridColumn: isMobile ? "span 12" : "span 4",
            gridRow: "span 2",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarChart
            data={barData}
            bgColor={colors.Font[300]}
            fontColor={colors.Font[400]}
          />
        </StyledBox>
      </Box>
    </Box>
  );
};
export default Dashboard;
