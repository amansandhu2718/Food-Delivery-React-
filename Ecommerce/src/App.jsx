// import { CssBaseline, ThemeProvider } from "@mui/material";
// import { ColorModeContext, useMode } from "./utils/Theme";
// import Topbar from "./Pages/Global/Topbar";
// import { Route, Routes } from "react-router-dom";
// import Dashboard from "./Pages/Dashboard/Index";
// import AppSidebar from "./Pages/Global/Sidebar";
// import Team from "./Pages/Teams/Team";
// import { useState } from "react";
// import Contacts from "./Pages/Contacts/Contacts";
// import Invoices from "./Pages/Invoices/Invoices";
// import CreateUser from "./Pages/Form/CreateUser";
// import BadGateway from "./Pages/Error/BadGateway";
// import { ToastContainer } from "react-toastify";
// import CalendarPage from "./Pages/Calendar/Calendar";
// import FaqPage from "./Pages/Faq/FaqPage";
// import BarChart from "./Components/BarChart";
// import BarChartPage from "./Pages/Bar/BarCharPage";
// import PieChartPage from "./Pages/Pie/PieChartPage";
// import LineChart from "./Components/LineChar";
// import LineChartPage from "./Pages/Line/LineChartPage";

// function App() {
//   const [theme, colorMode] = useMode();
//   const [open, SetOpen] = useState(false);

//   return (
//     <>
//       <ColorModeContext.Provider value={colorMode}>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <div className="app">
//             <AppSidebar open={open} SetOpen={SetOpen} />
//             <main className="content">
//               <Topbar open={open} SetOpen={SetOpen} />
//               <Routes>
//                 <Route path="/" element={<Dashboard />} />
//                 <Route path="/team" element={<Team />} />
//                 <Route path="/contacts" element={<Contacts />} />
//                 <Route path="/invoices" element={<Invoices />} />
//                 <Route path="/form" element={<CreateUser />} />
//                 <Route path="/bar" element={<BarChartPage />} />
//                 <Route path="/pie" element={<PieChartPage />} />
//                 <Route path="/line" element={<LineChartPage />} />
//                 <Route path="/faq" element={<FaqPage />} />
//                 {/* <Route path="/geography" element={<Geography />} /> */}
//                 <Route path="/calendar" element={<CalendarPage />} />
//                 <Route path="*" element={<BadGateway />} />
//               </Routes>
//             </main>
//           </div>
//         </ThemeProvider>
//       </ColorModeContext.Provider>
//       <ToastContainer />
//     </>
//   );
// }

// export default App;

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { themeSettings } from "./utils/Theme";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Index";
import Team from "./Pages/Teams/Team";
import Contacts from "./Pages/Contacts/Contacts";
import Invoices from "./Pages/Invoices/Invoices";
import CreateUser from "./Pages/Form/CreateUser";
import BadGateway from "./Pages/Error/BadGateway";
import { ToastContainer } from "react-toastify";
import CalendarPage from "./Pages/Calendar/Calendar";
import FaqPage from "./Pages/Faq/FaqPage";
import BarChartPage from "./Pages/Bar/BarCharPage";
import PieChartPage from "./Pages/Pie/PieChartPage";
import LineChartPage from "./Pages/Line/LineChartPage";
import Login from "./Pages/Login/Login";
import EmailOTP from "./Pages/Login/EmailOTP";
import Register from "./Pages/Login/Register";
import ProtectedLayout from "./Pages/Login/ProtectedLayout";
import Browse from "./Pages/Browse/Browse";
import PublicRoutes from "./Pages/Login/PublicRoutes";
import AdminLayout from "./Pages/Global/AdminLayout";

import { useEffect, useState, useMemo } from "react";
import api from "./utils/api";
import RestaurantsPage from "./Pages/Restautant/RestaurantsPage";
import FoodPage from "./Pages/Food/FoodPage";
import MenuPage from "./Pages/Menu/MenuPage";
import ProfilePage from "./Pages/Profile/ProfilePage";
import CartPage from "./Pages/Cart/CartPage";
import PaymentPage from "./Pages/Payment/PaymentPage";
import FoodRestaurantsPage from "./Pages/Food/FoodRestaurantsPage";
import AddRestaurant from "./Pages/Dashboard/AddRestaurant";
import ManageRestaurants from "./Pages/Dashboard/ManageRestaurants";
import EditRestaurant from "./Pages/Dashboard/EditRestaurant";
import OrdersPage from "./Pages/Orders/OrdersPage";
import SupportPage from "./Pages/Support/SupportPage";
import FavoritesPage from "./Pages/Favorites/FavoritesPage";
import { useSelector, useDispatch } from "react-redux";

import { loginSuccess, logout } from "./redux/Slices/authSlice";
import { clearAccessToken, setAccessToken } from "./utils/authService";
function App() {
  const mode = useSelector((state) => state.theme.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to refresh token and get user info
        const res = await api.post("/api/auth/refresh");
        if (res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          localStorage.setItem("accessToken", res.data.accessToken);
        }
        dispatch(
          loginSuccess({
            user: res.data.user,
            accessToken: res.data.accessToken,
          }),
        );
      } catch {
        // If refresh fails, clear everything
        clearAccessToken();
        localStorage.removeItem("accessToken");
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [dispatch]);
  const appRouter = createBrowserRouter([
    /**
     * Public routes
     */
    {
      element: <PublicRoutes />,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/verify-email", element: <EmailOTP /> },
      ],
    },

    /**
     * Authenticated users
     */
    {
      element: <ProtectedLayout />,
      children: [
        { path: "/", element: <Browse /> },
        { path: "/browse", element: <Browse /> },
        { path: "/explore", element: <RestaurantsPage /> },
        { path: "/ExploreFood", element: <FoodPage /> },
        { path: "/menu/:restaurantId", element: <MenuPage /> },
        { path: "/profile", element: <ProfilePage /> },
        { path: "/favorites", element: <FavoritesPage /> },
        { path: "/cart", element: <CartPage /> },
        { path: "/payment", element: <PaymentPage /> },
        { path: "/orders", element: <OrdersPage /> },
        { path: "/support", element: <SupportPage /> },
        {
          path: "/food/:productId/restaurants",
          element: <FoodRestaurantsPage />,
        },
        { path: "/profile", element: <ProfilePage /> },
        // { path: "/chat", element: <ChatPage /> },
        /**
         * Admin UI layout (UX only)
         */
      ],
    },
    {
      element: <AdminLayout />,
      children: [
        { path: "/admin", element: <Dashboard /> },
        { path: "/admin/dashboard", element: <Dashboard /> },
        { path: "/admin/owners", element: <Team /> },
        { path: "/admin/contacts", element: <Contacts /> },
        { path: "/admin/invoices", element: <Invoices /> },
        { path: "/admin/create-owner", element: <CreateUser /> },
        { path: "/admin/edit-owner/:id", element: <CreateUser /> },
        { path: "/admin/bar", element: <BarChartPage /> },
        { path: "/admin/pie", element: <PieChartPage /> },
        { path: "/admin/line", element: <LineChartPage /> },
        { path: "/admin/faq", element: <FaqPage /> },
        { path: "/admin/calendar", element: <CalendarPage /> },
        { path: "/admin/restaurants", element: <ManageRestaurants /> },
        { path: "/admin/add-restaurant", element: <AddRestaurant /> },
        { path: "/admin/edit-restaurant/:id", element: <EditRestaurant /> },
        { path: "/admin/*", element: <BadGateway /> },
      ],
    },

    { path: "*", element: <BadGateway /> },
  ]);

  return (
    <>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {loading ? (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              Checking authentication...
            </div>
          ) : (
            <RouterProvider router={appRouter} />
          )}
        </ThemeProvider>
      <ToastContainer />
    </>
  );
}

export default App;
