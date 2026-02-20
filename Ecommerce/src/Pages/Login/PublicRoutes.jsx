// Pages/Login/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useLoginInfo } from "../../utils/CustomHooks";

const PublicRoutes = () => {
  const [loginInfo] = useLoginInfo();

  // If user exists, redirect to main authenticated page
  if (loginInfo) {
    return <Navigate to="/browse" replace />; // or "/browse" if that's your main page
  }

  // Otherwise, render login/signup pages
  return <Outlet />;
};

export default PublicRoutes;
