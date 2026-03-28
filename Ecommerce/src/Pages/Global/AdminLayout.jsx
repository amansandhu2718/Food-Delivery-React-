import Topbar from "../Global/Topbar";
import AppSidebar from "../Global/Sidebar";
import { Outlet, Navigate, useLocation, matchPath } from "react-router-dom";
import ScrollToTop from "../../Components/ScrollToTop";

import { useMemo, useState } from "react";

import { useSelector } from "react-redux";
import { buildAdminSidebarMenu } from "./adminMenuMap";

function normalizePathname(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function isRestaurantOwnerRouteAllowed(pathname) {
  const path = normalizePathname(pathname);
  const allowed = [
    "/admin",
    "/admin/dashboard",
    "/admin/restaurants",
    "/admin/add-restaurant",
  ];
  if (allowed.includes(path)) return true;
  if (matchPath({ path: "/admin/edit-restaurant/:id", end: true }, path)) {
    return true;
  }
  return false;
}

const AdminLayout = () => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const currentRole = user?.role?.toUpperCase();

  const allowedRoles = ["ADMIN", "SUPER_ADMIN", "REST_OWNER"];

  const menuItems = useMemo(
    () => buildAdminSidebarMenu(user?.role),
    [user?.role],
  );

  if (!isAuthenticated || user == null || loading) {
    return <Navigate to="/login" replace />;
  }

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return <Navigate to="/browse" replace />;
  }

  if (currentRole === "REST_OWNER" && !isRestaurantOwnerRouteAllowed(location.pathname)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="app admin-shell">
      <ScrollToTop />
      <AppSidebar open={open} SetOpen={setOpen} data={menuItems} />
      <main className="content">
        <Topbar open={open} SetOpen={setOpen} />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
