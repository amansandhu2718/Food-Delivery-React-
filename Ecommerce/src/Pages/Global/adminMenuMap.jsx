import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BlockIcon from "@mui/icons-material/Block";

/**
 * Sidebar items for the admin dashboard shell (role-aware).
 */
export function buildAdminSidebarMenu(roleRaw) {
  const role = roleRaw?.toUpperCase?.() ?? "";

  const dashboard = {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <HomeIcon />,
  };

  if (role === "REST_OWNER") {
    return [
      dashboard,
      { isHeading: true, label: "My restaurant" },
      {
        label: "Restaurants & menus",
        path: "/admin/restaurants",
        icon: <RestaurantMenuIcon />,
      },
    ];
  }

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return [
      dashboard,
      { isHeading: true, label: "People" },
      {
        label: "Admins & owners",
        path: "/admin/owners",
        icon: <GroupsIcon />,
      },
      {
        label: "Create account",
        path: "/admin/create-owner",
        icon: <PersonAddIcon />,
      },
      { isHeading: true, label: "Restaurants" },
      {
        label: "Restaurants & menus",
        path: "/admin/restaurants",
        icon: <RestaurantMenuIcon />,
      },
      { isHeading: true, label: "Users" },
      {
        label: "Block users",
        path: "/admin/contacts",
        icon: <BlockIcon />,
      },
      { isHeading: true, label: "Insights" },
      {
        label: "Bar chart",
        path: "/admin/bar",
        icon: <BarChartOutlinedIcon />,
      },
      {
        label: "Pie chart",
        path: "/admin/pie",
        icon: <PieChartOutlineOutlinedIcon />,
      },
      {
        label: "Line chart",
        path: "/admin/line",
        icon: <TimelineOutlinedIcon />,
      },
    ];
  }

  return [dashboard];
}
