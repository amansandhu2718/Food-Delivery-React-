import {
  Box,
  Button,
  IconButton,
  Paper,
  Snackbar,
  Stack,
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
import LineChart from "./../../Components/LineChar";

import PieChart from "./../../Components/PieChart";
import BarChart from "../../Components/BarChart";
import Transactions from "../../Components/CustomList";

import { useRef, useEffect, useState } from "react";
import styled from "@emotion/styled";
import html2canvas from "html2canvas";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CloseIcon from "@mui/icons-material/Close";

import { getAccessToken } from "../../utils/authService";
import { useNavigate } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";

const StyledBox = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  ":hover": {
    outline: "2px solid #6e6e6e28",
  },
}));

const Dashboard = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const compactActions = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role?.toUpperCase();

  const [actionLoading, setActionLoading] = useState(null);

  const toolbarBtnSx = {
    borderRadius: "999px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 800,
    fontSize: compactActions ? "0.8rem" : "0.8rem",
    letterSpacing: "0.04em",
    py: 1.25,
    px: 2.25,
    minHeight: 44,
    width: "100%",
    justifyContent: "center",
  };

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
    setActionLoading("journal");
    try {
      const canvas = await html2canvas(document.body, {
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "dashboard-journal.png";
      link.click();
      setOpen(true);
    } catch (e) {
      console.error(e);
      alert("Could not capture the page. Try again.");
    } finally {
      setActionLoading(null);
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const snackbarAction = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Box sx={{ m: { xs: 2, sm: 3 } }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", lg: "flex-start" }}
        justifyContent="space-between"
        sx={{ width: "100%", mb: 2 }}
      >
        <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
          <Header title="DASHBOARD" subtitle="Welcome to your Dashboard " />
        </Box>

        <Paper elevation={0}>
          <Button
            sx={{
              p: { xs: 1.25, sm: 1.5 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "grey.50",
              width: { xs: "100%", lg: "min(100%, 240px)" },
              flexShrink: 0,
              alignSelf: { xs: "stretch", lg: "flex-start" },
            }}
            variant="contained"
            color="primary"
            disableElevation
            onClick={takeScreenshot}
            disabled={actionLoading !== null}
            loading={actionLoading === "journal"}
            startIcon={<DownloadoutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{
              ...toolbarBtnSx,
              gridColumn:
                userRole === "SUPER_ADMIN"
                  ? undefined
                  : { sm: "span 2", md: "span 1" },
            }}
          >
            {compactActions ? "Journal" : "Download journal"}
          </Button>
        </Paper>
      </Stack>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message="Journal image saved"
        action={snackbarAction}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

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
        {/* Row 1: Only show for ADMIN and SUPER_ADMIN */}
        {userRole !== "REST_OWNER" && (
          <>
            <Box
              sx={{
                gridColumn: isMobile ? "span 12" : "span 3",
                backgroundColor: theme.palette.background.paper,
                borderRadius: "32px",
                border:
                  "1px solid " +
                  (theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)"),
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
                    sx={{ color: "primary.main", fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              sx={{
                gridColumn: isMobile ? "span 12" : "span 3",
                backgroundColor: theme.palette.background.paper,
                borderRadius: "32px",
                border:
                  "1px solid " +
                  (theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)"),
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
                    sx={{ color: "primary.main", fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              sx={{
                gridColumn: isMobile ? "span 12" : "span 3",
                backgroundColor: theme.palette.background.paper,
                borderRadius: "32px",
                border:
                  "1px solid " +
                  (theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)"),
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
                    sx={{ color: "primary.main", fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              sx={{
                gridColumn: isMobile ? "span 12" : "span 3",
                backgroundColor: theme.palette.background.paper,
                borderRadius: "32px",
                border:
                  "1px solid " +
                  (theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)"),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stats
                title={stats.totalUsers || "0"}
                subtitle="Registered Users"
                progress={75}
                increase="+5%"
                icon={
                  <TrafficIcon
                    sx={{ color: "primary.main", fontSize: "26px" }}
                  />
                }
              />
            </Box>
          </>
        )}

        {/* Row 2: Charts and Transactions */}
        <Box
          sx={{
            gridColumn: isMobile
              ? "span 12"
              : userRole === "REST_OWNER"
                ? "span 12"
                : "span 8",
            gridRow: "span 2",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "32px",
            border:
              "1px solid " +
              (theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LineChart
            bgColor={theme.palette.background.paper}
            fontColor={theme.palette.text.secondary}
            data={lineData}
            isDashboard={true}
          />
        </Box>
        <Box
          sx={{
            gridColumn: isMobile ? "span 12" : "span 4",
            gridRow: "span 2",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "32px",
            border:
              "1px solid " +
              (theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Transactions
            data={recentTransactions}
            title="Recent Orders"
            emptyError="No Recent Transactions"
          />
        </Box>

        {/* Row 3: Insights - Only Pie for Owners, hide global charts */}
        <Box
          sx={{
            gridColumn: isMobile ? "span 12" : "span 4",
            gridRow: "span 2",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "32px",
            border:
              "1px solid " +
              (theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PieChart
            bgColor={theme.palette.background.paper}
            fontColor={theme.palette.text.secondary}
            data={pieData.slice(0, 3)}
            isDashboard={true}
          />
        </Box>

        {userRole !== "REST_OWNER" && (
          <>
            <Box
              sx={{
                gridColumn: isMobile ? "span 12" : "span 4",
                gridRow: "span 2",
                backgroundColor: theme.palette.background.paper,
                borderRadius: "32px",
                border:
                  "1px solid " +
                  (theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)"),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Transactions
                data={recentComplaints}
                title="Complaints from users"
                emptyError="No Recent Complaints"
              />
            </Box>
            <StyledBox
              sx={{
                gridColumn: isMobile ? "span 12" : "span 4",
                gridRow: "span 2",
                backgroundColor: theme.palette.background.paper,
                borderRadius: "32px",
                border:
                  "1px solid " +
                  (theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)"),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChart
                data={barData}
                bgColor={theme.palette.background.paper}
                fontColor={theme.palette.text.secondary}
              />
            </StyledBox>
          </>
        )}
      </Box>
    </Box>
  );
};
export default Dashboard;
