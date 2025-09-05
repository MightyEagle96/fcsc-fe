import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./useAuth";
import React from "react";
import LoggedOutPage from "../pages/LoggedOutPage";
import LoggedInPage from "../pages/candidate/LoggedinPage";
import NavbarComponent from "../components/NavbarComponent";
import ViewCandidates from "../pages/admin/ViewCandidates";
import FooterComponents from "../components/FooterComponents";
import { PublicAdminRoutes } from "../pages/admin/AdminRoutes";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/admin/AdminDashboard";
import VerifiedCandidates from "../pages/HR/VerifiedCandidates";
import AdminOfficers from "../pages/admin/AdminOfficers";
import OfficersView from "../pages/admin/OfficersView";
import HRCandidatesList from "../pages/HR/HRCandidatesList";
import RecommendedCandidates from "../pages/admin/RecommendedCandidates";
import LoadingPage from "../components/LoadingPage";
import MDACandidatesList from "../pages/admin/MDACandidates";
import PromoRecommended from "../pages/promotion/PromoRecommended";
import ApprovedCandidates from "../pages/promotion/ApprovedCandidates";
import SearchCandidate from "../pages/admin/SearchCandidate";
import MyProfile from "../pages/candidate/MyProfile";
import DataCorrection from "../pages/candidate/DataCorrection";

function MainRoutes() {
  const { loading, user } = useAuth();
  const publicRoutes = [
    { path: "/", component: <LoggedOutPage /> },
    { path: "/admin/*", component: <PublicAdminRoutes /> },
  ];

  const privateRoutes = [
    { path: "/", component: <LoggedInPage /> },
    { path: "/myprofile", component: <MyProfile /> },
    { path: "/datacorrection", component: <DataCorrection /> },
  ];

  const adminRoutes = [
    //admin
    { path: "/admin/dashboard", component: <AdminDashboard /> },
    { path: "/admin/candidates", component: <ViewCandidates /> },
    { path: "/admin/verifiedcandidates", component: <VerifiedCandidates /> },
    { path: "/admin/verifiedcandidates", component: <VerifiedCandidates /> },
    { path: "/admin/officers", component: <AdminOfficers /> },
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
        {/* <Route path="*" element={loading ? <LoadingPage /> : <NotFound />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FooterComponents />
    </BrowserRouter>
  );
}

export default MainRoutes;
