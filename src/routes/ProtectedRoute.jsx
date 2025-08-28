import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import LoadingPage from "../components/LoadingPage";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <LoadingPage />;
  }
  return user ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
