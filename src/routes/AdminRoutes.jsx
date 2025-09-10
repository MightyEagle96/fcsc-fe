import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import CreateAdminAccount from "../pages/admin/CreateAdminAccount";
import NotFound from "../pages/NotFound";
import LoadingPage from "../components/LoadingPage";
import ResetPassword from "../pages/admin/ResetPassword";
import PasswordReset from "../pages/admin/PasswordReset";

function PublicAdminRoutes() {
  const routes = [
    { path: "/login", component: <AdminLogin /> },
    {
      path: "/signup",
      component: <CreateAdminAccount />,
    },
    {
      path: "/forgot-password",
      component: <ResetPassword />,
    },
    {
      path: "/resetpassword/:id",
      component: <PasswordReset />,
    },
    { path: "*", component: <NotFound /> },
    // <Route path="*" element={<LoadingPage />} />,
  ];
  return (
    <Routes>
      {routes.map((c, i) => (
        <Route key={i} path={c.path} element={c.component} />
      ))}
    </Routes>
  );
}

export { PublicAdminRoutes };
