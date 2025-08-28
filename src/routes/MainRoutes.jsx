import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./useAuth";
import React from "react";
import LoggedOutPage from "../pages/LoggedOutPage";
import LoggedInPage from "../pages/LoggedinPage";
import NavbarComponent from "../components/NavbarComponent";

function MainRoutes() {
  const { user } = useAuth();
  const publicRoutes = [{ path: "/", component: <LoggedOutPage /> }];

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
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
