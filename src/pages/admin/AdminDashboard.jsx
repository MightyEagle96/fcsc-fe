import { useAppUser } from "../../contexts/AppUserContext";
import HRDashboard from "../../components/HRDashboard";
import AdminComponent from "../../components/AdminComponent";
import PromotionComponent from "../../components/PromotionComponent";

function AdminDashboard() {
  const { user } = useAppUser();

  return (
    <div className="mb-5 ">
      {/* This is strictly for admin */}
      {user.role === "admin" && user.specificRole === "admin" && (
        <AdminComponent />
      )}
      {/* This is strictly for admin */}
      {user.role === "admin" && user.specificRole === "hr" && <HRDashboard />}

      {/* This is strictly for promotion */}
      {user.role === "admin" && user.specificRole === "promotion" && (
        <PromotionComponent />
      )}
    </div>
  );
}

export default AdminDashboard;
