import Topbar from "../Global/Topbar";
import AppSidebar from "../Global/Sidebar";
import { Outlet, Navigate } from "react-router-dom";
import { useLoginInfo } from "../../utils/CustomHooks";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import ContactsIcon from "@mui/icons-material/Contacts";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import QuizIcon from "@mui/icons-material/Quiz";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import PublicIcon from "@mui/icons-material/Public";
import StoreIcon from "@mui/icons-material/Store";
import PostAddIcon from "@mui/icons-material/PostAdd";
const menuItems = [
  { label: "Overview", isHeading: true },
  { label: "Dashboard", path: "/admin/dashboard", icon: <HomeIcon /> },

  { label: "Management", isHeading: true },
  { label: "Restaurant Owners", path: "/admin/owners", icon: <GroupsIcon /> },
  { label: "Manage Restaurants", path: "/admin/restaurants", icon: <StoreIcon /> },
  { label: "Contacts", path: "/admin/contacts", icon: <ContactsIcon /> },
  { label: "Invoices", path: "/admin/invoices", icon: <ReceiptIcon /> },

  { label: "Pages", isHeading: true },
  { label: "Create Owner", path: "/admin/create-owner", icon: <DynamicFormIcon /> },
  { label: "Add Restaurant", path: "/admin/add-restaurant", icon: <PostAddIcon /> },
  { label: "Calendar", path: "/admin/calendar", icon: <CalendarTodayOutlinedIcon /> },

  { label: "Infographics", isHeading: true },
  { label: "Pie Chart", path: "/admin/pie", icon: <PieChartOutlineOutlinedIcon /> },
  { label: "Bar Chart", path: "/admin/bar", icon: <BarChartOutlinedIcon /> },
  { label: "Line Chart", path: "/admin/line", icon: <StackedLineChartIcon /> },
  { label: "Geography", path: "/admin/geography", icon: <PublicIcon /> },
];
const AdminLayout = () => {
  const [loginInfo] = useLoginInfo();
  const [open, SetOpen] = useState(false);

  // If not logged in, redirect to login
  if (!loginInfo) return <Navigate to="/login" replace />;

  // If logged in but not admin, redirect to main browse page
  if ((loginInfo.role || "").toUpperCase() !== "ADMIN") {
    return <Navigate to="/browse" replace />;
  }

  return (
    // <div className="app">
    //   <AppSidebar />
    //   <main className="content">
    //     <Topbar />
    //     <Outlet />
    //   </main>
    // </div>
    <div className="app">
      <AppSidebar open={open} SetOpen={SetOpen} data={menuItems} />
      <main className="content">
        <Topbar open={open} SetOpen={SetOpen} />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
