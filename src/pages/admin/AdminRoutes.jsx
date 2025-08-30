import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import CreateAdminAccount from "./CreateAdminAccount";
import NotFound from "../NotFound";

function PublicAdminRoutes() {
  const routes = [
    { path: "/login", component: <AdminLogin /> },
    {
      path: "/signup",
      component: <CreateAdminAccount />,
    },
    { path: "*", component: <NotFound /> },
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
