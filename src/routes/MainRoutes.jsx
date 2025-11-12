import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./useAuth";

import LoggedOutPage from "../pages/LoggedOutPage";
import LoggedInPage from "../pages/candidate/LoggedinPage";
import NavbarComponent from "../components/NavbarComponent";
import ViewCandidates from "../pages/admin/ViewCandidates";
import FooterComponents from "../components/FooterComponents";
import { PublicAdminRoutes } from "./AdminRoutes";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/admin/AdminDashboard";
import VerifiedCandidates from "../pages/HR/VerifiedCandidates";
import AdminOfficers from "../pages/admin/AdminOfficers";
import OfficersView from "../pages/admin/OfficersView";
import HRCandidatesList from "../pages/HR/HRCandidatesList";

import LoadingPage from "../components/LoadingPage";
import MDACandidatesList from "../pages/admin/MDACandidates";
import PromoRecommended from "../pages/promotion/PromoRecommended";
import ApprovedCandidates from "../pages/promotion/ApprovedCandidates";
import SearchCandidate from "../pages/admin/SearchCandidate";
import MyProfile from "../pages/candidate/MyProfile";
import DataCorrection from "../pages/candidate/DataCorrection";
import RecommendedCandidates from "../pages/HR/RecommendedCandidates";
import Corrections from "../pages/admin/Corrections";
import DeleteCandidate from "../pages/admin/DeleteCandidate";
import AdminLogs from "../pages/admin/AdminLogs";
import Rejections from "../pages/admin/Rejections";
import UpdateCandidate from "../pages/promotion/UpdateCandidate";
import CredentialReveal from "../pages/candidate/CredentialReveal";
import EvsLoginPage from "../pages/evs/EvsLoginPage";
import EvsManagement from "../pages/evs/EvsManagement";
import AccreditationSummary from "../pages/evs/AccreditationSummary";

function MainRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  const publicRoutes = [
    { path: "/", component: <LoggedOutPage /> },
    { path: "/credentialreveal", component: <CredentialReveal /> },
    { path: "/admin/*", component: <PublicAdminRoutes /> },
    { path: "/evs", component: <EvsLoginPage /> },
    { path: "/eslip", component: <EvsManagement /> },
  ];

  const privateRoutes = [
    { path: "/", component: <LoggedInPage /> },
    { path: "/documentstoupload", component: <MyProfile /> },
    { path: "/datacorrection", component: <DataCorrection /> },
  ];

  const adminRoutes = [
    //admin
    { path: "/admin/dashboard", component: <AdminDashboard /> },
    { path: "/admin/candidates", component: <ViewCandidates /> },
    { path: "/admin/deletebyadmin", component: <DeleteCandidate /> },
    { path: "/admin/verifiedcandidates", component: <VerifiedCandidates /> },
    { path: "/admin/officers", component: <AdminOfficers /> },
    { path: "/admin/rejections", component: <Rejections /> },
    { path: "/admin/officers/:slug", component: <OfficersView /> },
    { path: "/admin/mdacandidates/:slug", component: <MDACandidatesList /> },
    { path: "/admin/searchcandidate", component: <SearchCandidate /> },
    //hr
    { path: "/admin/hrcandidates/:slug", component: <HRCandidatesList /> },
    {
      path: "/admin/recommendedcandidates/:slug",
      component: <RecommendedCandidates />,
    },

    //promo recommended
    {
      path: "/admin/promorecommended/",
      component: <PromoRecommended />,
    },
    {
      path: "/admin/approvedcandidates/",
      component: <ApprovedCandidates />,
    },
    {
      path: "/admin/corrections/",
      component: <Corrections />,
    },
    {
      path: "/admin/logs/",
      component: <AdminLogs />,
    },
    {
      path: "/admin/updatecandidate/",
      component: <UpdateCandidate />,
    },
    {
      path: "/admin/evs/",
      component: <EvsManagement />,
    },
    {
      path: "/admin/accreditationsummary/",
      component: <AccreditationSummary />,
    },
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
