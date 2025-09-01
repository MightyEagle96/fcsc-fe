import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./useAuth";
import React from "react";
import LoggedOutPage from "../pages/LoggedOutPage";
import LoggedInPage from "../pages/LoggedinPage";
import NavbarComponent from "../components/NavbarComponent";
import ViewCandidates from "../pages/ViewCandidates";
import FooterComponents from "../components/FooterComponents";
import { PublicAdminRoutes } from "../pages/admin/AdminRoutes";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/admin/AdminDashboard";
import VerifiedCandidates from "../pages/admin/VerifiedCandidates";
import AdminOfficers from "../pages/admin/AdminOfficers";

function MainRoutes() {
  const { user } = useAuth();
  const publicRoutes = [
    { path: "/", component: <LoggedOutPage /> },
    { path: "/admin/*", component: <PublicAdminRoutes /> },
  ];

  const privateRoutes = [{ path: "/", component: <LoggedInPage /> }];

  const adminRoutes = [
    { path: "/admin/dashboard", component: <AdminDashboard /> },
    { path: "/admin/candidates", component: <ViewCandidates /> },
    { path: "/admin/verifiedcandidates", component: <VerifiedCandidates /> },
    { path: "/admin/verifiedcandidates", component: <VerifiedCandidates /> },
    { path: "/admin/officers", component: <AdminOfficers /> },
  ];
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        {user ? (
          <>
            {user.role === "admin"
              ? adminRoutes.map((route, i) => (
                  <Route key={i} path={route.path} element={route.component} />
                ))
              : privateRoutes.map((route, i) => (
                  <Route key={i} path={route.path} element={route.component} />
                ))}
            {/* <Route path="/candidates" element={<ViewCandidates />} /> */}
          </>
        ) : (
          <>
            {publicRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.component} />
            ))}
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FooterComponents />
    </BrowserRouter>
  );
}

export default MainRoutes;
