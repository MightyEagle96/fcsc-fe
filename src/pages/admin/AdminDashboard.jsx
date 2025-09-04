import { useAppUser } from "../../contexts/AppUserContext";
import HRDashboard from "../../components/HRDashboard";
import AdminComponent from "../../components/AdminComponent";
import PromotionComponent from "../../components/PromotionComponent";
import LoadingPage from "../../components/LoadingPage";

function AdminDashboard() {
  const { user } = useAppUser();

  // Map specificRole to component
  const roleComponents = {
    admin: <AdminComponent />,
    hr: <HRDashboard />,
    promotion: <PromotionComponent />,
  };

  if (user.role !== "admin") {
    return null; // or maybe show "Not Authorized"
  }

  return (
    <div className="mb-5 ">
      {roleComponents[user.specificRole] || <LoadingPage />}
    </div>
  );
}

export default AdminDashboard;
