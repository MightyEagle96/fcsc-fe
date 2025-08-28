import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MainRoutes from "./routes/MainRoutes";
import { ToastContainer } from "react-toastify";
import { AppUserProvider } from "./contexts/AppUserContext";
import AppTheme from "./themes/AppTheme";

function App() {
  return (
    <>
      <AppUserProvider>
        <AppTheme>
          <ToastContainer />
          <MainRoutes />
        </AppTheme>
      </AppUserProvider>
    </>
  );
}

export default App;
