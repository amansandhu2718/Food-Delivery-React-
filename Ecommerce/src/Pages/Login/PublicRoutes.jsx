// Pages/Login/PublicRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If user exists, redirect to main authenticated page
  if (isAuthenticated) {
    return <Navigate to="/browse" replace />; // or "/browse" if that's your main page
  }

  // Otherwise, render login/signup pages
  return <Outlet />;
};

export default PublicRoutes;
