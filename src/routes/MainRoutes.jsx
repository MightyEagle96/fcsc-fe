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

function MainRoutes() {
  const { user } = useAuth();
  const publicRoutes = [
    { path: "/", component: <LoggedOutPage /> },
    { path: "/admin/*", component: <PublicAdminRoutes /> },
  ];

  const privateRoutes = [{ path: "/", component: <LoggedInPage /> }];
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        {user ? (
          <>
            {privateRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.component} />
            ))}
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
